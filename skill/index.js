const http = require('http')
const util = require('util')
const AlexaSkill = require('./alexa-skill')
const dateUtil = require('./alexa-date-util')

/**
 * App ID for the skill
 */
const APP_ID = 'amzn1.ask.skill.85cf75b1-0b54-4e24-8f6a-010c0dc69ff0'

/**
 * SnowReport is a child of AlexaSkill.
 */
const SnowReport = function () {
  AlexaSkill.call(this, APP_ID)
}

// Config/constants
const apiBase = 'http://alexa-snow-report.herokuapp.com/snow/%s'
const promptText = 'What area would you like a snow report for?'
const signOffText = 'Think snowy thoughts!'
const knownStations = [
  ['baker', {
    id: 'baker',
    name: 'Mount Baker'
  }],
  ['hood', {
    id: 'hood',
    name: 'Mount Hood'
  }],
  ['rainier', {
    id: 'rainier',
    name: 'Mount Rainier'
  }],
  ['stevens', {
    id: 'stevens',
    name: 'Stevens Pass'
  }],
  ['white', {
    id: 'white',
    name: 'White Pass'
  }]
]
const stations = knownStations.reduce(function (map, item) {
  map[item[0]] = item[1]
  return map
}, {})

// Extend AlexaSkill
SnowReport.prototype = Object.create(AlexaSkill.prototype)
SnowReport.prototype.constructor = SnowReport

SnowReport.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
  // console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId)
  // any initialization logic goes here
}

SnowReport.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
  // console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId)
}

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
SnowReport.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
  // console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId)
  // any cleanup logic goes here
}

SnowReport.prototype.intentHandlers = {
  SnowReport: handleSnowReportRequest,
  KnownAreasIntent: function (intent, session, response) {
    handleKnownAreasRequest(response)
  },
  'AMAZON.HelpIntent': function (intent, session, response) {
    handleHelpRequest(response)
  },
  'AMAZON.StopIntent': function (intent, session, response) {
    response.tell(signOffText)
  },
  'AMAZON.CancelIntent': function (intent, session, response) {
    response.tell(signOffText)
  }
}

/**
 * Explains what this skill does
 */
function handleHelpRequest (response) {
  const text = [
    'I can give you recent snow information for popular backcountry skiing areas',
    'You can open Snow Report and ask for details about an area.',
    'For a list of supported areas, ask what areas are supported.',
    'Or you can say exit.',
    promptText
  ].join(' ')
  response.ask(text, promptText)
}

/**
 * Queries snow report API for the given area
 */
function getSnowInformation (id, callback) {
  const url = util.format(apiBase, id)

  http.get(url, function handleResponse (response) {
    console.log('starting request for ' + url)

    if (response.statusCode !== 200) {
      return callback(new Error('status code was not 200 for ' + url))
    }

    const body = []

    response.on('data', function (data) {
      body.push(data)
    })

    response.on('end', function () {
      const responseObject = JSON.parse(body.join(''))
      return callback(null, responseObject)
    })
  })
  .on('error', function handleHttpError (e) {
    console.log(e.message)
    return callback(e)
  })
}

/**
 * Responds with the requested snow report
 */
function handleSnowReportRequest (intent, session, response) {
  const area = intent.slots.area

  if (!area || !area.value) {
    return handleKnownAreasRequest(response)
  }

  const name = area.value
    .toLowerCase()
    .replace(/^mount/, '')
    .replace(/mountain|pass$/, '')
    .trim()
  const station = stations[name]

  if (!station) {
    return handleKnownAreasRequest(response)
  }

  getSnowInformation(station.id, function snowInformationCallback (err, data) {
    if (err) {
      return response.tell('Sorry, I had trouble finding data for that area')
    }

    const closing = data.snowDepth > 12
      ? 'That could be promising.'
      : 'Bummer.'
    const template = [
      'As of %s, %s had a snow depth of %n inches, received %n inches of',
      'snow over the last week, and received %n inches of precipitation',
      'in total.',
      closing
    ].join(' ')
    const text = util.format(
      template,
      dateUtil.getFormattedDate(new Date(data.lastObservation)),
      data.title,
      data.snowDepth,
      data.snowFall,
      data.precipitation
    )

    response.tellWithCard(text, 'SnowReport', text)
  })
}

/**
 * List the areas supported
 */
function handleKnownAreasRequest (response) {
  const text = [
    'Currently, I can find snow information for these areas: ',
    Object.keys(stations).join(', '),
    promptText
  ].join(' ')
  response.ask(text, promptText)
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  const snowReport = new SnowReport()
  snowReport.execute(event, context)
}
