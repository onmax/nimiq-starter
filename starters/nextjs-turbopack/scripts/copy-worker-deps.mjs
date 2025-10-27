#!/usr/bin/env node
import { copyFileSync, cpSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const publicDir = path.join(projectRoot, 'public')
const chunksDir = path.join(projectRoot, '.next', 'static', 'chunks')

try {
  mkdirSync(chunksDir, { recursive: true })

  // Copy comlink.min.js
  const comlinkSrc = path.join(publicDir, 'comlink.min.js')
  const comlinkDest = path.join(chunksDir, 'comlink.min.js')
  copyFileSync(comlinkSrc, comlinkDest)

  // Copy worker-wasm directory
  const workerSrc = path.join(publicDir, 'worker-wasm')
  const workerDest = path.join(chunksDir, 'worker-wasm')
  cpSync(workerSrc, workerDest, { recursive: true })

  console.log('✓ Copied Nimiq worker dependencies to static chunks')
}
catch (err) {
  console.error('Failed to copy Nimiq worker dependencies:', err)
  process.exit(1)
}
