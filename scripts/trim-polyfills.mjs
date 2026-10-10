// Next.js liefert in jedem Client-Bundle `polyfill-module` mit (Array.at, flat, fromEntries, hasOwn, trimStart …, ca. 14 KB).
// Alle unterstützten Browser (Chrome/Edge 111+, Firefox 111+, Safari 16.4+) haben diese Funktionen nativ.
// Ältere Browser erhalten weiterhin das separate `polyfill-nomodule`-Bundle von Next.js.
import { existsSync, writeFileSync } from "node:fs";

for (const file of [
  "node_modules/next/dist/build/polyfills/polyfill-module.js",
  "node_modules/next/dist/esm/build/polyfills/polyfill-module.js",
]) {
  if (existsSync(file)) writeFileSync(file, "// leer: moderne Browser benötigen keine Polyfills (siehe scripts/trim-polyfills.mjs)\n");
}
