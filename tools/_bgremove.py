"""
Shared helpers: strip baked-in backdrops from AI-generated character/creature
sheets that carry NO real alpha (fully opaque PNG). Two variants:

  strip_checker_background — for sheets with a near-white "transparency
    checkerboard" baked into the pixels (the commander/boss sheets).
  strip_dark_background — for sheets with a flat near-black backdrop (the
    alien-creature roster sheet).

Both flood-fill the background starting from the four image borders (so
enclosed pixels *inside* a subject — white armor, a bright eye — survive
even if they'd otherwise match the background criteria), then feather the
mask edge slightly so the cutout doesn't look jaggy at small on-screen sizes.
"""
import numpy as np
from PIL import Image
from scipy import ndimage


def _flood_from_border(bg_like: np.ndarray) -> np.ndarray:
    labels, _ = ndimage.label(bg_like, structure=np.ones((3, 3)))
    border_labels = set(labels[0, :].tolist()) | set(labels[-1, :].tolist())
    border_labels |= set(labels[:, 0].tolist()) | set(labels[:, -1].tolist())
    border_labels.discard(0)
    return np.isin(labels, list(border_labels))


def _finish(im: Image.Image, is_bg: np.ndarray, feather: float) -> Image.Image:
    alpha = np.where(is_bg, 0, 255).astype(np.float32)
    if feather > 0:
        alpha = ndimage.gaussian_filter(alpha, sigma=feather)
    alpha = np.clip(alpha, 0, 255).astype(np.uint8)
    out = np.dstack([np.asarray(im.convert("RGB")), alpha])
    return Image.fromarray(out, mode="RGBA")


def strip_checker_background(im: Image.Image, brightness_thresh=222, sat_tol=14, feather=1.2):
    rgb = np.asarray(im.convert("RGB"), dtype=np.int16)
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = mx - mn
    bg_like = (mx >= brightness_thresh) & (sat <= sat_tol)
    return _finish(im, _flood_from_border(bg_like), feather)


def strip_dark_background(im: Image.Image, brightness_thresh=40, feather=1.0):
    rgb = np.asarray(im.convert("RGB"), dtype=np.int16)
    mx = rgb.max(axis=2)
    bg_like = mx <= brightness_thresh
    return _finish(im, _flood_from_border(bg_like), feather)


def keep_largest_component(im: Image.Image) -> Image.Image:
    """Drop every foreground blob except the largest (by opaque pixel count).
    Cleans up stray speckle/UI-chrome fragments a wide crop picks up near a
    card border — those survive the flood-fill as small disconnected islands
    since they're not touching the crop's edge either."""
    alpha = np.asarray(im.split()[-1])
    labels, n = ndimage.label(alpha > 16, structure=np.ones((3, 3)))
    if n == 0:
        return im
    sizes = ndimage.sum(np.ones_like(labels), labels, index=range(1, n + 1))
    biggest = int(np.argmax(sizes)) + 1
    mask = labels == biggest
    out = np.asarray(im).copy()
    out[..., 3] = np.where(mask, out[..., 3], 0)
    return Image.fromarray(out, mode="RGBA")
