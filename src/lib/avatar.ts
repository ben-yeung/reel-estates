import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";

/**
 * Deterministic commenter avatar.
 *
 * We have far too many comment authors (100+ handles across the reels) to hand
 * author a photo for each, so avatars are generated from the handle itself with
 * DiceBear. Same handle -> same avatar, forever, and any new commenter added to
 * the data automatically gets a stable, unique one with zero image assets.
 *
 * Generation is pure client/server JS (no network), so this is safe to call
 * during render. Results are memoized per handle since the reel data is static.
 */
const cache = new Map<string, string>();

// Warm, on-brand background tones. DiceBear picks one deterministically from the
// seed, so the comment list gets pleasant variety without any per-handle config.
const backgroundColor = ["f4e6d9", "efd9c7", "e8d3c3", "f7ece0", "ecdccb"];

export function commenterAvatar(author: string): string {
  const seed = author.replace(/^@/, "");
  const cached = cache.get(seed);
  if (cached) return cached;

  const uri = createAvatar(notionists, {
    seed,
    radius: 50,
    backgroundColor,
  }).toDataUri();

  cache.set(seed, uri);
  return uri;
}
