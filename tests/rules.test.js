import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import convexPlugin from '@convex-dev/eslint-plugin'
import unicornPlugin from 'eslint-plugin-unicorn'
import convexRulesPlugin from '../flat/convex-plugin.js'
import { boundariesConfig } from '../flat/core/boundaries.js'
import { unicornConfig, unicornTsx, unicornFilename } from '../flat/core/unicorn.js'
import { convex } from '../flat/convex.js'

const PRESETS = [
  { subpath: '.', name: 'base' },
  { subpath: './nextjs', name: 'nextjs' },
  { subpath: './nodejs', name: 'nodejs' },
  { subpath: './react', name: 'react' },
  { subpath: './convex', name: 'convex' },
  { subpath: './turbo', name: 'turbo' },
  { subpath: './boundaries', name: 'boundaries' },
]

async function loadPreset(subpath, name) {
  const file = subpath === '.' ? 'index' : subpath.slice(2)
  const mod = await import(`../flat/${file}.js`)
  return mod[name]
}

describe('rule existence: every configured plugin rule exists in a registered plugin', () => {
  for (const { subpath, name } of PRESETS) {
    it(`${subpath} rules resolve to plugin rules`, async () => {
      const config = await loadPreset(subpath, name)
      const plugins = {}
      for (const entry of config) {
        Object.assign(plugins, entry.plugins ?? {})
      }
      for (const entry of config) {
        for (const ruleId of Object.keys(entry.rules ?? {})) {
          const splitAt = ruleId.lastIndexOf('/')
          if (splitAt === -1) continue
          const pluginName = ruleId.slice(0, splitAt)
          const ruleName = ruleId.slice(splitAt + 1)
          const plugin = plugins[pluginName]
          assert.ok(
            plugin,
            `"${ruleId}": plugin "${pluginName}" is not registered in preset "${name}"`
          )
          assert.ok(
            plugin.rules?.[ruleName],
            `"${ruleId}" does not exist in plugin "${pluginName}" (preset "${name}")`
          )
        }
      }
    })
  }
})

describe('unicorn curation: every rule is an explicit decision', () => {
  const configured = new Set(
    [unicornConfig, unicornTsx, unicornFilename]
      .flatMap((entry) => Object.keys(entry.rules))
      .filter((ruleId) => ruleId.startsWith('unicorn/'))
      .map((ruleId) => ruleId.slice('unicorn/'.length))
  )

  it('every active unicorn rule is listed (error or off) in flat/core/unicorn.js', () => {
    const missing = Object.entries(unicornPlugin.rules)
      .filter(([, rule]) => !rule.meta?.deprecated)
      .map(([ruleName]) => ruleName)
      .filter((ruleName) => !configured.has(ruleName))
    assert.deepEqual(missing, [], `undecided unicorn rules:\n${missing.join('\n')}`)
  })

  it('no configured unicorn rule is deprecated upstream', () => {
    const deprecated = [...configured].filter(
      (ruleName) => unicornPlugin.rules[ruleName]?.meta?.deprecated
    )
    assert.deepEqual(
      deprecated,
      [],
      `deprecated rules still pinned (migrate to successors): ${deprecated.join(', ')}`
    )
  })
})

describe('boundaries: no-private stays enforced despite recommended disabling it', () => {
  it('boundaries/no-private is pinned as error with allowUncles', () => {
    assert.deepEqual(boundariesConfig.rules['boundaries/no-private'], [
      'error',
      { allowUncles: true },
    ])
  })
})

describe('convex: every official @convex-dev rule is pinned as error', () => {
  const pinned = new Map(
    convex
      .flatMap((entry) => Object.entries(entry.rules ?? {}))
      .filter(([ruleId]) => ruleId.startsWith('@convex-dev/'))
  )

  it('all plugin rules are enforced', () => {
    const missing = Object.keys(convexPlugin.rules)
      .map((ruleName) => `@convex-dev/${ruleName}`)
      .filter((ruleId) => pinned.get(ruleId) !== 'error')
    assert.deepEqual(missing, [], `official convex rules not pinned as error: ${missing.join(', ')}`)
  })

  it('does not duplicate official rules in the bundled plugin', () => {
    assert.equal(convexRulesPlugin.rules['no-filter-on-query'], undefined)
  })
})
