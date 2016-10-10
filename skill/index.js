const AlexaSkill = require('./AlexaSkill')

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space fact"
 *  Alexa: "Here's your space fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = 'amzn1.ask.skill.828f6157-f2ac-4fb5-945b-647d795b43bd'

/**
 * SnowReport is a child of AlexaSkill.
 */
var SnowReport = function () {
  AlexaSkill.call(this, APP_ID)
}

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
  GetNewFactIntent: function (intent, session, response) {
    handleSnowReportRequest(response)
  },
  'AMAZON.HelpIntent': function (intent, session, response) {
    response.ask('You can say tell me a space fact, or, you can say exit... What can I help you with?', 'What can I help you with?')
  },
  'AMAZON.StopIntent': function (intent, session, response) {
    var speechOutput = 'Goodbye'
    response.tell(speechOutput)
  },
  'AMAZON.CancelIntent': function (intent, session, response) {
    var speechOutput = 'Goodbye'
    response.tell(speechOutput)
  }
}

/**
 * Gets the snow requested snow report
 */
function handleSnowReportRequest (response) {
  // response.tellWithCard(speechOutput, cardTitle, speechOutput)
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  var snowReport = new SnowReport()
  snowReport.execute(event, context)
}
