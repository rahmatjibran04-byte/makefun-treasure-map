// main.ts — Charm the Cartographers: A One Day Treasure Map Sprint
//
// Deterministic entrypoint (Node 22, stdlib only, no dependencies).
// Copies `entry.png` (sitting next to this file, or under
// $MAKEFUN_BOT_DIR) to `$MAKEFUN_OUTPUT_DIR/entry.png` (default /output),
// but only after it passes every bounty gate:
//
//   (a) the file exists and starts with the PNG signature
//       89 50 4E 47 0D 0A 1A 0A
//   (b) file size <= 1,048,576 bytes (1 MiB)
//   (c) dimensions <= 1024 x 1024 px (parsed manually from the IHDR chunk:
//       width = uint32 big-endian at bytes 16-19, height at bytes 20-23)
//
// On any gate failure it prints a clear error to stderr and exits 1
// without writing anything. On success it prints a short summary to stdout.
// The copy is byte-for-byte, so repeated runs are bit-identical.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const MAX_BYTES = 1_048_576;
const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;
const ENTRY_NAME = "entry.png";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const sourceDir = process.env.MAKEFUN_BOT_DIR || here;
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  const sourcePath = join(sourceDir, ENTRY_NAME);
  const outputPath = join(outputDir, ENTRY_NAME);

  if (!existsSync(sourcePath)) {
    fail(
      `gate failed (missing file): source file not found: ${sourcePath} — ` +
        `place entry.png next to main.ts or set MAKEFUN_BOT_DIR`,
    );
  }

  const bytes = readFileSync(sourcePath);

  if (bytes.length < PNG_SIGNATURE.length) {
    fail(
      `gate failed (malformed PNG): ${sourcePath} is ${bytes.length} bytes, ` +
        `too short to even hold the 8-byte PNG signature`,
    );
  }
  if (!bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    fail(
      `gate failed (not a PNG): ${sourcePath} does not start with the PNG ` +
        `signature — expected 89 50 4E 47 0D 0A 1A 0A, ` +
        `got ${bytes.subarray(0, 8).toString("hex").toUpperCase()}`,
    );
  }

  if (bytes.length > MAX_BYTES) {
    fail(
      `gate failed (file size): ${sourcePath} is ${bytes.length} bytes, ` +
        `limit is ${MAX_BYTES} bytes (1 MiB) — ` +
        `re-export entry.png smaller / more compressed`,
    );
  }

  // PNG layout: 8-byte signature, then the IHDR chunk:
  //   bytes 8-11  chunk length (must be 13), bytes 12-15 chunk type "IHDR",
  //   bytes 16-19 width (uint32 BE), bytes 20-23 height (uint32 BE).
  // A file with a valid signature but a corrupt/missing IHDR is not a
  // usable PNG, so the chunk header is checked too — not just the size.
  if (bytes.length < 24) {
    fail(
      `gate failed (malformed PNG): ${sourcePath} is only ` +
        `${bytes.length} bytes, too short to hold a PNG IHDR chunk ` +
        `(need at least 24 bytes)`,
    );
  }
  const ihdrLength = bytes.readUInt32BE(8);
  const ihdrType = bytes.subarray(12, 16).toString("ascii");
  if (ihdrLength !== 13 || ihdrType !== "IHDR") {
    fail(
      `gate failed (malformed PNG): first chunk of ${sourcePath} is ` +
        `not IHDR (length=${ihdrLength}, type="${ihdrType}") — ` +
        `the file is not a well-formed PNG`,
    );
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width === 0 || height === 0) {
    fail(
      `gate failed (malformed PNG): IHDR dimensions are ${width}x${height} px ` +
        `— a PNG must be at least 1x1 px`,
    );
  }
  if (width > MAX_WIDTH || height > MAX_HEIGHT) {
    fail(
      `gate failed (dimensions): ${sourcePath} is ${width}x${height} px, ` +
        `limit is ${MAX_WIDTH}x${MAX_HEIGHT} px — ` +
        `re-render entry.png at ${MAX_WIDTH}x${MAX_HEIGHT} px or smaller`,
    );
  }

  mkdirSync(outputDir, { recursive: true });
  copyFileSync(sourcePath, outputPath);

  console.log(`wrote ${outputPath}`);
  console.log(`file: ${ENTRY_NAME}`);
  console.log(`size: ${bytes.length} bytes`);
  console.log(`dimensions: ${width}x${height} px`);
}

main();
