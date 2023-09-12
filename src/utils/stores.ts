import { writable } from "svelte/store"
import type { ArtPiece } from "./types"

export const artObjectsStore = writable<ArtPiece[]>([])
export const pageStore = writable(0)
