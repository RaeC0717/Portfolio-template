#!/usr/bin/env node
/**
 * Sync photo position/scale to config + public/photo-position.json (production reads JSON).
 * Usage:
 *   npm run sync-photo-position '{"x":50,"y":55,"scale":1.1}'
 *   npm run sync-photo-position -- --push   (then git add, commit, push to deploy)
 * On macOS: copy JSON to clipboard, then run without args (reads pbpaste).
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const args = process.argv.slice(2);
const doPush = args.includes("--push");
const jsonArg = args.find((a) => a !== "--push");

function getJsonInput() {
  if (jsonArg) return jsonArg;
  if (process.platform === "darwin") {
    try {
      return execSync("pbpaste", { encoding: "utf8" }).trim();
    } catch {
      // ignore
    }
  }
  console.error("Usage: npm run sync-photo-position [JSON] [--push]");
  console.error('Example: npm run sync-photo-position \'{"x":50,"y":55,"scale":1.1}\' --push');
  console.error("On macOS: copy JSON then run without args (reads clipboard). --push = git add, commit, push.");
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

const root = path.join(__dirname, "..");

// Update src/config/photoPosition.ts
const configPath = path.join(root, "src", "config", "photoPosition.ts");
let content = fs.readFileSync(configPath, "utf8");
content = content.replace(/\bx:\s*[\d.]+\b/, `x: ${x}`);
content = content.replace(/\by:\s*[\d.]+\b/, `y: ${y}`);
content = content.replace(/\bscale:\s*[\d.]+\b/, `scale: ${scale}`);
fs.writeFileSync(configPath, content);

// Update public/photo-position.json (production fetches this at runtime)
const publicPath = path.join(root, "public", "photo-position.json");
fs.writeFileSync(publicPath, JSON.stringify({ x, y, scale }) + "\n");

console.log("Updated config + public/photo-position.json: x=%s, y=%s, scale=%s", x, y, scale);

if (doPush) {
  execSync("git add src/config/photoPosition.ts public/photo-position.json", { cwd: root, stdio: "inherit" });
  try {
    execSync('git diff --cached --quiet', { cwd: root });
  } catch {
    execSync('git commit -m "chore: sync photo position"', { cwd: root, stdio: "inherit" });
    execSync("git push", { cwd: root, stdio: "inherit" });
    console.log("Pushed. Deployment will pick up the new position.");
  }
}
