"""
Shared helper: strip a baked-in near-white "transparency checkerboard" from
AI-generated character/creature sheets. These sheets have NO real alpha
(fully opaque PNG) — the checkerboard is rendered directly into the pixels
as a human-readable "this is transparent" convention, so a naive alpha-bbox
crop keeps a faint checker halo around the subject.

Flood-fills the near-white/near-gray, low-saturation background starting
from the four image borders (so enclosed light regions *inside* a subject,
like white armor plating, survive), then feathers the mask edge slightly so
the cutout doesn't look jaggy at small on-screen sizes.
"""
import numpy as np
from PIL import Image
from scipy import ndimage


def strip_checker_background(im: Image.Image, brightness_thresh=222, sat_tol=14, feather=1.2):
    rgb = np.asarray(im.convert("RGB"), dtype=np.int16)
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    sat = mx - mn
    bg_like = (mx >= brightness_thresh) & (sat <= sat_tol)

    # Flood-fill from the border: only background-like pixels *connected* to
    # an edge count as background, so enclosed light pixels inside the
    # subject are preserved.
    labels, _ = ndimage.label(bg_like, structure=np.ones((3, 3)))
    border_labels = set(labels[0, :].tolist()) | set(labels[-1, :].tolist())
    border_labels |= set(labels[:, 0].tolist()) | set(labels[:, -1].tolist())
    border_labels.discard(0)
    is_bg = np.isin(labels, list(border_labels))

    alpha = np.where(is_bg, 0, 255).astype(np.float32)
    if feather > 0:
        alpha = ndimage.gaussian_filter(alpha, sigma=feather)
    alpha = np.clip(alpha, 0, 255).astype(np.uint8)

    out = np.dstack([np.asarray(im.convert("RGB")), alpha])
    return Image.fromarray(out, mode="RGBA")
