---
name: node-build-chain
description: "Use when a build chain, document conversion pipeline, or automation workflow needs a Node.js/npm environment in this workspace."
---

# Node.js Build Chain

This workspace has a Node.js and npm environment available for creating and running build chains.

## Project Commands

- Install dependencies with `npm install`.
- Run the complete build with `npm run build`.
- Run the Markdown-to-PDF build with `npm run build:pdf`.

The current PDF build reads `explication-*.md` and `variant-*.md` files from `brass-birmingham/rules/` and writes one PDF per source file to `brass-birmingham/rules/pdf/`.

## Workflow

1. Inspect the existing `package.json` and scripts before adding a new build step.
2. Prefer npm scripts and local dependencies so the workflow is reproducible.
3. Keep generated files in a clearly named output directory.
4. Run the relevant npm build command after changing the chain.