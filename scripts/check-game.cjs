const assert = require('node:assert/strict')
const ts = require('typescript')
const fs = require('node:fs')
const vm = require('node:vm')
const source = ts.transpileModule(fs.readFileSync('src/lib/game.ts', 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText
const scope = {exports:{}, Date, Set}
vm.runInNewContext(source, scope)
const {streakOf, experience, dayKey} = scope.exports
const now = new Date(2026, 10, 18, 0, 1)
assert.equal(dayKey(now), '2026-11-18')
assert.equal(streakOf([], now), 0)
assert.equal(streakOf(['2026-11-17','2026-11-16'], now), 2)
assert.equal(streakOf(['2026-11-16'], now), 0)
assert.equal(streakOf(['2026-11-18','2026-11-18','2026-11-17'], now), 2)
assert.equal(streakOf(['2026-11-19'], now), 0)
assert.equal(streakOf(['2026-03-01','2026-02-28'], new Date(2026,2,1)), 2)
assert.equal(streakOf(['2025-12-31'], new Date(2026,0,1)), 1)
assert.equal(experience(['1:1','1:1','1:2','90:3','91:1','1:4','bad']), 30)
console.log('Game checks passed: midnight, gaps, duplicates, month/year boundary, XP validation.')
const progressExports = {}
const storage = new Map()
let profile = {lessonCompletions:[],dayDates:{}}
let pushes = 0
const progressSource = ts.transpileModule(fs.readFileSync('src/lib/progress.ts','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText
vm.runInNewContext(progressSource, {
 exports:progressExports, Date, Set, Number, Array, Math, JSON,
 localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},
 require: name => name === './game' ? scope.exports : name === './widget' ? {syncWidget(){}} : name === 'react' ? {} : name === '../data/program' ? {PROGRAM_DAYS:90,SESSIONS_PER_DAY:3,TEST_UNLOCK_ALL:false} : name === './profile' ? {loadProfile:()=>profile,saveProfile:patch=>{profile={...profile,...patch}}} : name === '../services/remote' ? {pushCompletion(){pushes++}} : undefined
})
progressExports.completeLesson(1,1)
progressExports.completeLesson(1,1)
assert.equal(profile.lessonCompletions.length,1)
assert.equal(pushes,1)
progressExports.completeLesson(1,2)
assert.equal(profile.lessonCompletions.length,2)
assert.equal(JSON.parse(storage.get('fitjoy.activeDates')).length,1)
progressExports.completeLesson(91,1)
progressExports.completeLesson(2,NaN)
assert.equal(profile.lessonCompletions.length,2)
console.log('Completion checks passed: replay deduplication, daily activity deduplication, invalid sessions.')
