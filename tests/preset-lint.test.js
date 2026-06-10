import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ESLint } from 'eslint'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FIXTURE_DIR = join(__dirname, 'fixtures', 'preset-lint')

const PRESETS = [
  { subpath: '.', name: 'base', files: ['src/sample.ts'] },
  { subpath: './nextjs', name: 'nextjs', files: ['src/sample.ts', 'src/component.tsx'] },
  { subpath: './nodejs', name: 'nodejs', files: ['src/sample.ts'] },
  { subpath: './react', name: 'react', files: ['src/sample.ts', 'src/component.tsx'] },
  { subpath: './convex', name: 'convex', files: ['convex/messages.ts'] },
  { subpath: './turbo', name: 'turbo', files: ['src/plain.js'] },
  { subpath: './boundaries', name: 'boundaries', files: ['src/plain.js'] },
]

describe('preset lint: real ESLint run per preset — config, options, and parse must hold', () => {
  for (const { subpath, name, files } of PRESETS) {
    it(`${subpath} lints fixture without config/schema/fatal errors`, async () => {
      const file = subpath === '.' ? 'index' : subpath.slice(2)
      const mod = await import(`../flat/${file}.js`)
      const eslint = new ESLint({
        cwd: FIXTURE_DIR,
        overrideConfigFile: true,
        overrideConfig: mod[name],
      })
      const results = await eslint.lintFiles(files)
      assert.ok(results.length > 0, `no fixture files linted for preset "${name}"`)
      const fatal = results
        .flatMap((result) => result.messages.map((m) => ({ file: result.filePath, ...m })))
        .filter((message) => message.fatal)
      assert.deepEqual(
        fatal,
        [],
        `fatal messages in preset "${name}": ${JSON.stringify(fatal, null, 2)}`
      )
    })
  }
})
