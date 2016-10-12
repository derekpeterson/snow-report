'use strict'

const dataTypes = require('../constants').dataTypes

module.exports = munge

/**
 * Builds an object with data about an array of observations
 * @param  {array} observations An array of objects representing observations
 * @return {object}
 */
function munge (observations) {
  const latest = getLatest(observations)
  const snowDepth = getLatest(observations.filter(obs => {
    return obs.datatype === dataTypes.get('snowDepth').id
  }))

  return {
    lastObservation: latest && latest.date,
    precipitation: sum('precipitation', observations),
    snowDepth: snowDepth && snowDepth.value || 0,
    snowFall: sum('snowFall', observations)
  }
}

/**
 * Pluck the observation with the latest date
 * @param  {array} observations  An array of objects representing observations
 * @return {object}
 */
function getLatest (observations) {
  let latest = null

  for (let obs of observations) {
    if (!latest || new Date(obs.date) > new Date(latest.date)) {
      latest = obs
    }
  }

  return latest
}

/**
 * Sums the values for observations of a given type
 * @param  {string} type         The type from dataTypes to target
 * @param  {array} observations  An array of objects representing observations
 * @return {number}
 */
function sum (type, observations) {
  const dataType = dataTypes.get(type).id

  return observations.reduce((total, obs) => {
    if (obs.datatype === dataType) {
      return total + obs.value
    }

    return total
  }, 0)
}
