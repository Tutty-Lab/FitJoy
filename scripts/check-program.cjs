// Regression checks for program selection/localization; no browser or server writes.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

function sandbox(lang) {
  let overrides = {}
  const file = path.resolve(__dirname, '../src/data/program.ts')
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText
  const module = { exports: {} }
  const context = {
    module, exports: module.exports,
    localStorage: { getItem: () => JSON.stringify(overrides) },
    require(name) {
      if (name === '../lib/i18n') return { lang, L: (de, vi) => lang === 'vi' ? vi : de }
      if (!name.endsWith('.json')) throw new Error(`Unexpected dependency: ${name}`)
      return JSON.parse(fs.readFileSync(path.resolve(path.dirname(file), name), 'utf8'))
    },
  }
  vm.runInNewContext(code, context, { filename: file })
  return { program: module.exports, setOverrides: value => { overrides = value } }
}

for (const language of ['de', 'vi']) {
  const { program: p, setOverrides } = sandbox(language)
  assert.equal(p.programDays.length, 90)
  assert.equal(new Set(p.programDays.map(d => d.tag)).size, 90)
  assert.equal(p.SESSIONS_PER_DAY, 3)
  assert.equal(p.PRACTICE_SECONDS, 60)
  assert.equal(p.TEST_UNLOCK_ALL, false)
  const blockPicks = []
  for (let first = 1; first <= 90; first += 3) {
    const id = p.bonusFor(first).id
    blockPicks.push(id)
    assert.equal(p.bonusFor(first + 1).id, id)
    assert.equal(p.bonusFor(first + 2).id, id)
  }
  assert.equal(new Set(blockPicks).size, 30)

  const [a, b] = p.bonusExercises
  setOverrides({ 1: { bonusUebung: a.id }, 2: { bonusUebung: b.id } })
  for (const day of [1, 2, 3]) assert.equal(p.bonusFor(day).id, a.id, 'First valid assignment must win throughout a block')
  setOverrides({ 1: { bonusUebung: 'removed-exercise' }, 2: { bonusUebung: b.id } })
  for (const day of [1, 2, 3]) assert.equal(p.bonusFor(day).id, b.id, 'Invalid IDs must not hide a valid block assignment')
  setOverrides({ 90: { bonusUebung: a.id } })
  for (const day of [88, 89, 90]) assert.equal(p.bonusFor(day).id, a.id, 'Last block must resolve consistently')

  setOverrides({ 1: { begruessung: 'Custom greeting', bonusImpuls: 'Custom bonus prompt', affirmation: 'Custom affirmation' } })
  assert.equal(p.localDay(1).begruessung, 'Custom greeting')
  assert.equal(p.localDay(1).bonusImpuls, 'Custom bonus prompt')
  assert.equal(p.affirmationFor(1), 'Custom affirmation')
  setOverrides({})
  assert.ok(p.localDay(1).begruessung)
  assert.ok(p.affirmationFor(1))
  assert.equal(p.baseVideo(), p.baseExercise.video)
  console.log(`PASS ${language}: 30 stable bonus blocks, conflicting/invalid picks, last block, admin overrides, content fallback`)
}
