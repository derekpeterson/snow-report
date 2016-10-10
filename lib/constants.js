'use strict'

const stations = new Map([
  ['baker', {
    id: 'GHCND:USS0021A36S',
    title: 'Mount Baker at Nooksack',
    lat: '48.82',
    lng: '-121.93'
  }],
  ['hood', {
    id: 'GHCND:USS0021D08S',
    title: 'Mount Hood',
    lat: '45.32',
    lng: '-121.72'
  }],
  ['rainier', {
    id: 'GHCND:USC00456898',
    title: 'Mount Rainier at Paradise',
    lat: '46.7858',
    lng: '-121.7425'
  }],
  ['stevens', {
    id: 'GHCND:USS0021B01S',
    title: 'Stevens Pass',
    lat: '47.75',
    lng: '-121.09'
  }],
  ['white', {
    id: 'GHCND:USS0021C28S',
    title: 'White Pass',
    lat: '46.64',
    lng: '-121.38'
  }]
])

const dataTypes = new Map([
  ['precipitation', {
    id: 'PRCP',
    title: 'Precipitation',
    units: 'inches'
  }],
  ['snowFall', {
    id: 'SNOW',
    title: 'Snowfall',
    units: 'inches'
  }],
  ['snowDepth', {
    id: 'SNWD',
    title: 'Snow depth',
    units: 'inches'
  }]
])

module.exports = {
  dataTypes: dataTypes,
  stations: stations
}
