import { updateTag } from "next/cache";

/*
 * Expire cached queries and the client router cache after a mutation, so the
 * next render (including the one that answers this action) reads fresh data.
 */
export function invalidate(...tags: string[]) {
  for (const tag of new Set(tags)) {
    updateTag(tag);
  }
}
