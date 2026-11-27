import { fixupRule } from '@eslint/compat'

// ESLint 10 removed the rule-context methods that older plugins still call
// (`context.getSourceCode()`, `context.getFilename()`, ...), so their rules
// crash there. `fixupRule` adds those methods back and changes nothing else.
// The rules are replaced in place instead of wrapping the plugin, so the plugin
// object stays the one a project gets from its own import: ESLint rejects two
// different objects registered under the same plugin name.
export function withLegacyContext(plugin) {
  for (const [name, rule] of Object.entries(plugin.rules)) {
    plugin.rules[name] = fixupRule(rule)
  }
  return plugin
}
