const test = require('ava')

const munger = require('../../lib/mungers/snow')

const fixture = require('../_fixtures/snow.json').results

test('identifies the last observation', t => {
  const data = munger(fixture)
  t.is('2016-10-06T00:00:00', data.lastObservation)
})

test('notes snow depth', t => {
  const data = munger(fixture)
  t.is(0, data.snowDepth)
})

test('totals recent snowfall', t => {
  const data = munger(fixture)
  t.is(0, data.snowFall)
})

test('totals recent precipitation', t => {
  const data = munger(fixture)
  t.is(290, data.precipitation)
})
