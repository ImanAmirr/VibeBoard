from urllib.parse import urlparse
import requests

IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg")

def is_image_url(url: str) -> bool:
    if not url:
        return False

    path = urlparse(url).path.lower()
    if path.endswith(IMAGE_EXTENSIONS):
        return True

    try:
        response = requests.head(url, timeout=3, allow_redirects=True)
        content_type = response.headers.get("content-type", "")
        return content_type.startswith("image/")
    except Exception:
        return False