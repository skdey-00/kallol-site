#!/usr/bin/env node
// Convert all PNG/JPG images under public/ to WebP in place (originals removed).
// Run with --dry-run to list what would be converted without changing anything.
import { readdirSync, statSync, existsSync, unlinkSync } from "fs"
import { join, extname, dirname, basename } from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public")
const dryRun = process.argv.includes("--dry-run")
const CONVERT = new Set([".png", ".jpg", ".jpeg"])

async function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) out.push(...(await walk(p)))
    else out.push(p)
  }
  return out
}

const files = (await walk(root)).filter((f) => CONVERT.has(extname(f).toLowerCase()))
let before = 0
let after = 0

for (const src of files) {
  const dest = join(dirname(src), basename(src, extname(src)) + ".webp")
  if (existsSync(dest)) {
    console.log(`SKIP (target exists): ${src}`)
    continue
  }
  if (dryRun) {
    console.log(`would convert: ${src}`)
    continue
  }
  const srcSize = statSync(src).size
  const info = await sharp(src).webp({ quality: 80 }).toFile(dest)
  unlinkSync(src)
  before += srcSize
  after += info.size
  console.log(`${src}: ${(srcSize / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB`)
}

const mb = (n) => (n / 1024 / 1024).toFixed(1)
const converted = files.length
console.log(
  `\nConverted ${converted} images: ${mb(before)} -> ${mb(after)}` +
    (before > 0 ? ` (${Math.round((1 - after / before) * 100)}% smaller)` : ""),
)
