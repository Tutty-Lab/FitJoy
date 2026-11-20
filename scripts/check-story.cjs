const assert = require('node:assert/strict')
const fs = require('node:fs')
const ts = require('typescript')
const vm = require('node:vm')
const path = require('node:path')
const cache = new Map()
function readModule(file) {
  file=path.resolve(file)
  if(cache.has(file))return cache.get(file)
  const exports={};cache.set(file,exports)
  const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText
  vm.runInNewContext(source,{exports,Set,Number,require:id=>readModule(path.join(path.dirname(file),id+'.ts'))})
  return exports
}
const {regions,regionFor,firstWeek,episodeFor,earnedEpisodes,restoredInRegion,storyChapters,chapterFor} = readModule('src/data/story.ts')
assert.equal(storyChapters.length,9)
assert.equal(new Set(Array.from({length:90},(_,i)=>episodeFor(i+1).reward.de)).size,90)
assert.equal(new Set(Array.from({length:90},(_,i)=>episodeFor(i+1).before.vi)).size,90)
for(const chapter of storyChapters){
  assert.equal(chapter.discoveries.length,10)
  assert.ok(chapter.opening.de.length>30&&chapter.opening.vi.length>30)
  assert.ok(chapter.ending.de.length>30&&chapter.ending.vi.length>30)
  assert.equal(chapterFor(chapter.start+9).start,chapter.start)
  assert.deepEqual(JSON.parse(JSON.stringify(episodeFor(chapter.start+9).after)),JSON.parse(JSON.stringify(chapter.ending)))
}
for(let day=1;day<=90;day++) {
  const region = regionFor(day)
  assert.ok(day>=region.start && day<=region.end)
  const episode = episodeFor(day)
  assert.equal(episode.day,day)
  for(const key of ['title','before','after','reward']) for(const language of ['de','vi']) assert.ok(episode[key][language].length>5)
}
assert.equal(regionFor(30).id,'harbor')
assert.equal(regionFor(31).id,'forest')
assert.equal(regionFor(60).id,'forest')
assert.equal(regionFor(61).id,'lighthouse')
assert.equal(regionFor(90).id,'lighthouse')
assert.equal(new Set(firstWeek.map(item=>item.day)).size,7)
assert.equal(earnedEpisodes([]).length,0)
assert.equal(earnedEpisodes([1,1,2,8,90,0,91,NaN,1.5]).length,4)
assert.equal(restoredInRegion([1,1,2,30,31,0,91,NaN,1.5],regions[0]),3)
assert.equal(restoredInRegion([1,31,31,60,61],regions[1]),2)
const progress = [1,2,3,4,5,6,7]
assert.equal(earnedEpisodes(progress).length,7)
assert.equal(restoredInRegion(progress,regions[0]),7)
// No date/streak input: a missed day cannot remove story rewards.
assert.equal(earnedEpisodes(progress).length,earnedEpisodes([...progress]).length)
console.log('Story checks passed: 90-day coverage, bilingual copy, region boundaries, unique rewards, invalid days, preserved discoveries.')
