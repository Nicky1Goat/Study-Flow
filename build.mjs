#!/usr/bin/env node
/* Plant Bloom — build step.
 * Compiles src/app.jsx → app.js (Babel, classic JSX runtime) so the app
 * runs with no in-browser transpiler. React is vendored in vendor/.
 *
 * Usage:  npm install   (first time, installs @babel/core + preset-react)
 *         node build.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { transformSync } from '@babel/core';
import presetReact from '@babel/preset-react';

const src = readFileSync(new URL('./src/app.jsx', import.meta.url), 'utf8');
const { code } = transformSync(src, {
  presets: [[presetReact, { runtime: 'classic' }]],
  filename: 'app.jsx',
  compact: false,
});
const header =
  '// Plant Bloom — COMPILED OUTPUT. Do not edit by hand.\n' +
  '// Source: src/app.jsx · rebuild with: node build.mjs\n';
writeFileSync(new URL('./app.js', import.meta.url), header + code + '\n');
console.log('Built app.js (' + code.length + ' chars) from src/app.jsx');
