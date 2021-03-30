/* eslint-disable node/no-extraneous-require */
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const config = require('config')
let server

require('../../../back-end/api/utils/initDB')()

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})) // support encoded bodies

mongoose.connection.on('connected', () => {
  server = app.listen(config.TESTPORT)
})

process.on('SIGTERM', () => {
  app.close()
})

process.on('SIGTERM', shutDown)
process.on('SIGINT', shutDown)

function shutDown() {
  server.close()
}
