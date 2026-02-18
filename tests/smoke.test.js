import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FLAT_DIR = join(__dirname, '..', 'flat')

const PRESETS = [
  { subpath: '.', name: 'base' },
  { subpath: './nextjs', name: 'nextjs' },
  { subpath: './nodejs', name: 'nodejs' },
  { subpath: './react', name: 'react' },
  { subpath: './convex', name: 'convex' },
  { subpath: './turbo', name: 'turbo' },
  { subpath: './boundaries', name: 'boundaries' },
]

describe('exports: all presets resolve as non-empty arrays', () => {
  for (const { subpath, name } of PRESETS) {
    it(`${subpath} → "${name}"`, async () => {
      const file = subpath === '.' ? 'index' : subpath.slice(2)
      const mod = await import(`../flat/${file}.js`)
      assert.ok(mod[name], `missing named export "${name}"`)
      assert.ok(Array.isArray(mod[name]), `"${name}" is not an array`)
      assert.ok(mod[name].length > 0, `"${name}" is empty`)
    })
  }
})

describe('exports: default exports match named exports', () => {
  for (const { subpath, name } of PRESETS) {
    if (subpath === '.') continue
    it(`${subpath} default === ${name}`, async () => {
      const file = subpath.slice(2)
      const mod = await import(`../flat/${file}.js`)
      assert.equal(mod.default, mod[name], `default export !== named export "${name}"`)
    })
  }
})

describe('exports: barrel re-exports all presets', () => {
  it('index.js has all 7 exports', async () => {
    const mod = await import('../flat/index.js')
    for (const { name } of PRESETS) {
      assert.ok(mod[name], `missing "${name}" from barrel`)
    }
  })
})

describe('config shape: each preset entry is a valid config object', () => {
  for (const { subpath, name } of PRESETS) {
    it(`${subpath} entries are objects`, async () => {
      const file = subpath === '.' ? 'index' : subpath.slice(2)
      const mod = await import(`../flat/${file}.js`)
      for (const entry of mod[name]) {
        assert.equal(typeof entry, 'object', `entry in "${name}" is not an object`)
        assert.ok(entry !== null, `entry in "${name}" is null`)
      }
    })
  }
})

describe('config shape: presets with rules have valid rule values', () => {
  const VALID_SEVERITIES = ['off', 'warn', 'error', 0, 1, 2]

  for (const { subpath, name } of PRESETS) {
    it(`${subpath} rule severities are valid`, async () => {
      const file = subpath === '.' ? 'index' : subpath.slice(2)
      const mod = await import(`../flat/${file}.js`)
      for (const entry of mod[name]) {
        if (!entry.rules) continue
        for (const [rule, value] of Object.entries(entry.rules)) {
          const severity = Array.isArray(value) ? value[0] : value
          assert.ok(
            VALID_SEVERITIES.includes(severity),
            `"${rule}" has invalid severity: ${JSON.stringify(severity)}`
          )
        }
      }
    })
  }
})

describe('config shape: plugin entries register plugin objects', () => {
  for (const { subpath, name } of PRESETS) {
    it(`${subpath} plugins are objects with rules`, async () => {
      const file = subpath === '.' ? 'index' : subpath.slice(2)
      const mod = await import(`../flat/${file}.js`)
      for (const entry of mod[name]) {
        if (!entry.plugins) continue
        for (const [pluginName, plugin] of Object.entries(entry.plugins)) {
          assert.equal(typeof plugin, 'object', `plugin "${pluginName}" is not an object`)
          assert.ok(plugin !== null, `plugin "${pluginName}" is null`)
          assert.ok(plugin.rules || plugin.configs, `plugin "${pluginName}" has no rules or configs`)
        }
      }
    })
  }
})

describe('hygiene: no leaked internal references', () => {
  it('no @vllnt/ in any shipped file', () => {
    const files = collectFiles(FLAT_DIR)
    for (const file of files) {
      const content = readFileSync(file, 'utf8')
      assert.ok(!content.includes('@vllnt/'), `found @vllnt/ in ${file}`)
    }
  })

  it('no "private" in package.json', () => {
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'))
    assert.equal(pkg.private, undefined, 'package.json still has "private" field')
  })
})

describe('package.json: required fields', () => {
  let pkg

  it('loads package.json', () => {
    pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'))
  })

  it('has name, version, license', () => {
    assert.ok(pkg.name, 'missing name')
    assert.ok(pkg.version, 'missing version')
    assert.ok(pkg.license, 'missing license')
  })

  it('has exports for all presets', () => {
    const expected = ['.', './nextjs', './nodejs', './react', './convex', './turbo', './boundaries']
    for (const exp of expected) {
      assert.ok(pkg.exports[exp], `missing export "${exp}"`)
    }
  })

  it('has peer dependencies', () => {
    assert.ok(pkg.peerDependencies.eslint, 'missing eslint peer')
    assert.ok(pkg.peerDependencies.prettier, 'missing prettier peer')
  })

  it('has files field', () => {
    assert.ok(pkg.files, 'missing files field')
    assert.ok(pkg.files.includes('flat'), 'files does not include "flat"')
  })

  it('has repository', () => {
    assert.ok(pkg.repository, 'missing repository')
  })
})

function collectFiles(dir) {
  const results = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) results.push(...collectFiles(full))
    else if (entry.name.endsWith('.js')) results.push(full)
  }
  return results
}
