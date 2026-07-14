IMAGE_EXTENSIONS = (".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg")

def is_image_url(url: str) -> bool:
    if not url:
        return False

    return url.lower().endswith(IMAGE_EXTENSIONS)