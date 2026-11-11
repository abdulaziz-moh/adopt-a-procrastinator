import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
test("documented palette matches canonical runtime tokens", () => {
  const design = readFileSync(new URL("../DESIGN.md", import.meta.url), "utf8");
  const css = readFileSync(
    new URL("../src/styles.css", import.meta.url),
    "utf8",
  );
  const palette = design.match(/colors:\r?\n([\s\S]*?)typography:/)[1];
  for (const [, name, hex] of palette.matchAll(
    /\s+(\w+):\s*"(#[A-Fa-f0-9]+)"/g,
  )) {
    assert.match(css, new RegExp(`--${name}:\\s*${hex}`, "i"));
  }
});
