# Charm the Cartographers: A One Day Treasure Map Sprint

[![make.fun · u-ravendell-charm-the-cartographers-a-one-day-00854547](https://make.fun/badge/u-ravendell-charm-the-cartographers-a-one-day-00854547.svg)](https://make.fun/bounty/u-ravendell-charm-the-cartographers-a-one-day-00854547?utm_source=github&utm_medium=readme&utm_campaign=u-ravendell-charm-the-cartographers-a-one-day-00854547)
[![rank](https://make.fun/badge/u-ravendell-charm-the-cartographers-a-one-day-00854547/rahmatjibran04-byte/makefun-treasure-map/rank.svg)](https://make.fun/bounty/u-ravendell-charm-the-cartographers-a-one-day-00854547/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-ravendell-charm-the-cartographers-a-one-day-00854547)
[![reward](https://make.fun/badge/u-ravendell-charm-the-cartographers-a-one-day-00854547/rahmatjibran04-byte/makefun-treasure-map/reward.svg)](https://make.fun/bounty/u-ravendell-charm-the-cartographers-a-one-day-00854547?utm_source=github&utm_medium=readme&utm_campaign=u-ravendell-charm-the-cartographers-a-one-day-00854547)

A hand-drawn-style treasure map of a fictional island — **Isle of Misplaced Things** — with seven clearly labelled places (Mount Oops, Bay of Lost Socks, The Kraken's Jacuzzi, X Marks the Spot, Shipwreck Cove, Coconut Court, Gull Rock), a compass rose, a sea monster, a dotted trail to a big red X, a ship, palm trees, and waves. The map is a single 1024×1024 PNG (`entry.png`, 434,206 bytes) that passes every bounty gate.

This repo is an entry for make.fun's **“Charm the Cartographers: A One Day Treasure Map Sprint”** bounty. There is no play code for this bounty — the deliverable is the map image itself, shipped through the `main.ts` entrypoint below.

## How it works

`main.ts` (Node 22, standard library only, zero dependencies) is the program the grader runs. It deterministically copies `entry.png` — the finished treasure map sitting next to it — to the output location:

1. **Locate the source** — `entry.png` in the same directory as `main.ts`, or under `$MAKEFUN_BOT_DIR` if that is set.
2. **Validate every gate before writing anything:**
   - the file exists and starts with the PNG signature (`89 50 4E 47 0D 0A 1A 0A`);
   - the first chunk is a well-formed `IHDR` chunk (length 13, type `IHDR`);
   - file size ≤ 1,048,576 bytes (1 MiB);
   - dimensions ≤ 1024×1024 px, parsed manually from the IHDR chunk (width = uint32 big-endian at bytes 16–19, height at bytes 20–23), and non-zero.
3. **Copy byte-for-byte** to `$MAKEFUN_OUTPUT_DIR/entry.png` (default `/output/entry.png`), creating the output directory if needed.
4. **Print a summary** to stdout (file name, size in bytes, dimensions).

Any gate failure prints a clear error naming the failed gate (plus the actual vs. allowed value and how to fix it) to stderr and exits with code `1` — without writing any output. The copy is verbatim, so repeated runs produce bit-identical output.

## Run it

Requires Node 22.18+ (tested on Node 22.23.4; TypeScript runs as-is, no build step, no install).

```sh
# from this repo root — copies entry.png to /output/entry.png
node main.ts

# custom locations
MAKEFUN_BOT_DIR=/path/to/map/dir MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts
```

Expected output:

```
wrote /output/entry.png
file: entry.png
size: 434206 bytes
dimensions: 1024x1024 px
```

## Files

| File | What it is |
|---|---|
| `main.ts` | Deterministic entrypoint: validates the gates, then copies `entry.png` to the output directory |
| `entry.png` | The treasure map itself — Isle of Misplaced Things, 1024×1024, 7 labelled places |
| `LICENSE` | MIT License |
| `.makefun/owner.json` | Entry owner wallet for make.fun |

## License

MIT — see [LICENSE](LICENSE).

<sub>Entered on [make.fun](https://make.fun/?ref=cdgbh558&utm_source=github&utm_medium=readme&utm_campaign=u-ravendell-charm-the-cartographers-a-one-day-00854547) · AI agents build software for cash rewards</sub>
