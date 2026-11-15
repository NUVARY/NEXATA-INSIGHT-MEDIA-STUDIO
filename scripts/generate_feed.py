
from pathlib import Path
from html.parser import HTMLParser
from html import unescape
from urllib.parse import quote
from datetime import datetime, timezone, timedelta
from xml.etree import ElementTree as ET
from xml.sax.saxutils import escape
import re

# CONFIGURACIÓN
BLOG_DIR = Path("BLOGS")
OUTPUT = Path("feed.xml")
SITE_URL = "https://nexata.site/"
FEED_URL = "https://nexata.site/feed.xml"
LOCAL_TZ = timezone(timedelta(hours=-6))

MONTHS = {
    "enero": 1, "febrero": 2, "marzo": 3,
    "abril": 4, "mayo": 5, "junio": 6,
    "julio": 7, "agosto": 8, "septiembre": 9,
    "setiembre": 9, "octubre": 10, "noviembre": 11,
    "diciembre": 12
}


class BlogParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.meta = {}
        self.h1 = []
        self.date = []
        self.capture_h1 = False
        self.capture_date = False
        self.date_depth = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)

        if tag.lower() == "meta":
            key = attrs.get("property") or attrs.get("name")
            value = attrs.get("content", "")
            if key and value:
                self.meta[key.lower()] = value.strip()

        if tag.lower() == "h1" and not self.h1:
            self.capture_h1 = True

        classes = attrs.get("class", "").split()
        if "autor-fecha" in classes:
            self.capture_date = True
            self.date_depth = 1
        elif self.capture_date and tag.lower() not in ("br", "img", "hr", "meta", "link", "input"):
            self.date_depth += 1

    def handle_endtag(self, tag):
        if tag.lower() == "h1":
            self.capture_h1 = False

        if self.capture_date:
            self.date_depth -= 1
            if self.date_depth <= 0:
                self.capture_date = False

    def handle_data(self, data):
        if self.capture_h1:
            self.h1.append(data)

        if self.capture_date:
            self.date.append(data)


def clean_text(value):
    value = unescape(value or "")
    return re.sub(r"\s+", " ", value).strip()


def parse_date(value):
    value = clean_text(value)
    value = re.sub(r"^Editado:\s*", "", value, flags=re.I)

    # Formato: 31/07/2025 - 14:30
    match = re.search(
        r"(\d{1,2})/(\d{1,2})/(\d{4})\s*[-–]\s*(\d{1,2}):(\d{2})",
        value
    )

    if match:
        day, month, year, hour, minute = map(int, match.groups())
        try:
            date = datetime(year, month, day, hour, minute, tzinfo=LOCAL_TZ)
            return date.astimezone(timezone.utc)
        except ValueError:
            return None

    # Formato: 12 de septiembre de 2026 a las 5:33 a.m.
    match = re.search(
        r"(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})"
        r"(?:\s+a\s+las\s+(\d{1,2}):(\d{2})\s*(a\.?\s*m\.?|p\.?\s*m\.?)?)?",
        value,
        re.I
    )

    if match:
        day, month_name, year, hour, minute, period = match.groups()
        month = MONTHS.get(month_name.lower())

        if not month:
            return None

        hour = int(hour or 0)
        minute = int(minute or 0)

        if period:
            period = period.lower().replace(" ", "").replace(".", "")
            if period == "pm" and hour < 12:
                hour += 12
            elif period == "am" and hour == 12:
                hour = 0

        try:
            date = datetime(
                int(year), month, int(day),
                hour, minute, tzinfo=LOCAL_TZ
            )
            return date.astimezone(timezone.utc)
        except ValueError:
            return None

    return None


def rss_date(date):
    return date.strftime("%a, %d %b %Y %H:%M:%S GMT")


def get_article_content(html):
    match = re.search(
        r"<article\b[^>]*class\s*=\s*['\"][^'\"]*\bblog-content\b[^'\"]*['\"][^>]*>"
        r"(.*?)</article\s*>",
        html,
        flags=re.I | re.S
    )
    return match.group(1).strip() if match else ""


def get_first_paragraph(content):
    match = re.search(r"<p\b[^>]*>(.*?)</p\s*>", content, re.I | re.S)
    if not match:
        return ""

    text = re.sub(r"<[^>]+>", " ", match.group(1))
    return clean_text(text)


def cdata(value):
    return "<![CDATA[" + (value or "").replace(
        "]]>", "]]]]><![CDATA[>"
    ) + "]]>"


def read_old_feed():
    if not OUTPUT.exists():
        return {}, []

    try:
        root = ET.parse(OUTPUT).getroot()
        channel = root.find("channel")

        if channel is None:
            return {}, []

        old_by_link = {}
        old_items = []

        for item in channel.findall("item"):
            link = (item.findtext("link") or "").strip()
            if link:
                old_by_link[link] = item
                old_items.append(item)

        return old_by_link, old_items

    except ET.ParseError:
        print("Advertencia: el RSS anterior no pudo leerse.")
        return {}, []


def build_item(path, old_by_link):
    relative = path.relative_to(Path(".")).as_posix()
    encoded_path = quote(relative, safe="/-._~")
    link = SITE_URL.rstrip("/") + "/" + encoded_path

    html = path.read_text(encoding="utf-8-sig")
    parser = BlogParser()
    parser.feed(html)

    title = clean_text(" ".join(parser.h1))
    title = title or parser.meta.get("og:title", "")
    title = re.sub(
        r"\s+[–—-]\s+NEXATA INSIGHT MEDIA STUDIO$",
        "",
        title,
        flags=re.I
    )

    description = parser.meta.get("og:description", "")
    description = clean_text(description)

    content = get_article_content(html)

    if not description:
        description = get_first_paragraph(content)

    image = parser.meta.get("og:image", "")
    date = parse_date(" ".join(parser.date))

    old_item = old_by_link.get(link)

    # Si el blog no tiene fecha reconocible, conservar la anterior.
    if date is None and old_item is not None:
        old_date = old_item.findtext("pubDate")
        if old_date:
            return build_item_with_old_date(
                title, link, description, image, content,
                old_item, old_date
            )

    return {
        "title": title,
        "link": link,
        "description": description,
        "image": image,
        "content": content,
        "date": rss_date(date) if date else "",
        "old": old_item
    }


def build_item_with_old_date(
    title, link, description, image, content, old_item, old_date
):
    return {
        "title": title,
        "link": link,
        "description": description,
        "image": image,
        "content": content,
        "date": old_date,
        "old": old_item
    }


def make_xml_item(post):
    old_item = post["old"]

    parts = [
        "    <item>",
        f"      <title>{escape(post['title'])}</title>",
        f"      <link>{escape(post['link'])}</link>",
        f"      <guid isPermaLink=\"true\">{escape(post['link'])}</guid>"
    ]

    if post["date"]:
        parts.append(f"      <pubDate>{escape(post['date'])}</pubDate>")

    # Conservar las categorías que ya existían en el RSS.
    if old_item is not None:
        for category in old_item.findall("category"):
            value = category.text or ""
            if value:
                parts.append(f"      <category>{escape(value)}</category>")

    if post["description"]:
        parts.append(
            "      <description>" +
            cdata(post["description"]) +
            "</description>"
        )

    if post["image"]:
        parts.append(
            f"      <media:content url=\"{escape(post['image'])}\" medium=\"image\" />"
        )

    if post["content"]:
        parts.append(
            "      <content:encoded>" +
            cdata(post["content"]) +
            "</content:encoded>"
        )

    parts.append("    </item>")
    return "\n".join(parts)


def main():
    if not BLOG_DIR.exists():
        raise FileNotFoundError("No se encontró la carpeta BLOGS.")

    old_by_link, old_items = read_old_feed()

    files = sorted(
        BLOG_DIR.rglob("*.html"),
        key=lambda path: path.as_posix().lower()
    )

    posts = []

    for path in files:
        try:
            post = build_item(path, old_by_link)

            if not post["title"]:
                print(f"Sin título, se omite: {path}")
                continue

            posts.append(post)
            print(f"Procesado: {path}")

        except Exception as error:
            print(f"Error en {path}: {error}")

    if not posts and not old_items:
        raise RuntimeError("No se encontraron publicaciones para el RSS.")

    # Conservar elementos anteriores que no correspondan a archivos
    # actualmente encontrados dentro de BLOGS.
    found_links = {post["link"] for post in posts}

    for old_item in old_items:
        old_link = (old_item.findtext("link") or "").strip()

        if old_link and old_link not in found_links:
            print(f"Se conserva publicación anterior: {old_link}")
            posts.append({
                "title": old_item.findtext("title", ""),
                "link": old_link,
                "description": old_item.findtext("description", ""),
                "image": "",
                "content": "",
                "date": old_item.findtext("pubDate", ""),
                "old": old_item
            })

    # Ordenar por fecha, de más reciente a más antigua.
    def sort_key(post):
        parsed = parse_rss_date(post["date"])
        return parsed or datetime.min.replace(tzinfo=timezone.utc)

    posts.sort(key=sort_key, reverse=True)

    now = rss_date(datetime.now(timezone.utc))

    items_xml = "\n".join(make_xml_item(post) for post in posts)

    xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>NEXATA INSIGHT MEDIA STUDIO</title>
    <link>{SITE_URL}</link>
    <description>Publicaciones seleccionadas de NEXATA con recomendaciones, tecnología, información y contenido de interés.</description>
    <language>es-MX</language>
    <lastBuildDate>{now}</lastBuildDate>
    <atom:link href="{FEED_URL}" rel="self" type="application/rss+xml" />
{items_xml}
  </channel>
</rss>
'''

    # Validar el XML antes de sobrescribir el RSS.
    ET.fromstring(xml)

    OUTPUT.write_text(xml, encoding="utf-8")

    print("--------------------------------")
    print(f"RSS actualizado: {OUTPUT}")
    print(f"Publicaciones: {len(posts)}")
    print("--------------------------------")


def parse_rss_date(value):
    if not value:
        return None

    try:
        from email.utils import parsedate_to_datetime
        date = parsedate_to_datetime(value)

        if date.tzinfo is None:
            date = date.replace(tzinfo=timezone.utc)

        return date.astimezone(timezone.utc)

    except Exception:
        return None


if __name__ == "__main__":
    main()
