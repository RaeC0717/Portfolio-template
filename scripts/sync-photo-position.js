#!/usr/bin/env node
/**
 * Sync current photo position/scale to src/config/photoPosition.ts (for production).
 * Usage:
 *   npm run sync-photo-position '{"x":50,"y":55,"scale":1.1}'
 * Or on macOS: copy the JSON to clipboard, then run:
 *   npm run sync-photo-position
 *   (reads from pbpaste)
 */

const fs = require("fs");
const path = require("path");

function getJsonInput() {
  const arg = process.argv[2];
  if (arg) return arg;
  if (process.platform === "darwin") {
    try {
      return require("child_process").execSync("pbpaste", { encoding: "utf8" }).trim();
    } catch {
      // ignore
    }
  }
  console.error("Usage: npm run sync-photo-position [JSON]");
  console.error('Example: npm run sync-photo-position \'{"x":50,"y":55,"scale":1.1}\'');
  console.error("On macOS you can copy the JSON and run without arguments (reads from clipboard).");
  process.exit(1);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

const jsonStr = getJsonInput();
let data;
try {
  data = JSON.parse(jsonStr);
} catch (e) {
  console.error("Invalid JSON:", e.message);
  process.exit(1);
}

const x = clamp(Number(data.x), 0, 100);
const y = clamp(Number(data.y), 0, 100);
const scale = clamp(Number(data.scale), 1, 2.5);

const configPath = path.join(__dirname, "..", "src", "config", "photoPosition.ts");
let content = fs.readFileSync(configPath, "utf8");

content = content.replace(/\bx:\s*[\d.]+\b/, `x: ${x}`);
content = content.replace(/\by:\s*[\d.]+\b/, `y: ${y}`);
content = content.replace(/\bscale:\s*[\d.]+\b/, `scale: ${scale}`);

fs.writeFileSync(configPath, content);
console.log("Updated src/config/photoPosition.ts with x=%s, y=%s, scale=%s", x, y, scale);
