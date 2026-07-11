import type { AttachmentSlot } from "../types";
import { getAttachmentDef } from "../data/attachmentDefs";
import type { SaveData } from "../save/SaveManager";

/** Returns the tier the player would buy next for `slot`, or null if maxed. */
export function nextTier(save: SaveData, slot: AttachmentSlot) {
  const def = getAttachmentDef(slot);
  const owned = save.attachmentLevels[slot] ?? 0;
  return owned < def.tiers.length ? def.tiers[owned] : null;
}

export function canAfford(save: SaveData, slot: AttachmentSlot): boolean {
  const tier = nextTier(save, slot);
  return tier !== null && save.motes >= tier.cost;
}

/** Attempts to buy the next tier for `slot`. Returns true if the purchase succeeded. */
export function purchaseTier(save: SaveData, slot: AttachmentSlot): boolean {
  const tier = nextTier(save, slot);
  if (!tier || save.motes < tier.cost) return false;
  save.motes -= tier.cost;
  save.attachmentLevels[slot] = (save.attachmentLevels[slot] ?? 0) + 1;
  return true;
}
