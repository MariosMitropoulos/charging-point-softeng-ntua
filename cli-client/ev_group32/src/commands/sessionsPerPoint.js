/* eslint-disable unicorn/filename-case */
/* eslint-disable no-console */
/* eslint-disable node/no-unpublished-require */
const {Command, flags} = require('@oclif/command')

const https = require('https')
const axios = require('axios')
const chalk = require('chalk')
const config = require('config')

axios.defaults.httpsAgent = new https.Agent()

class SessionsPerPoint extends Command {
  async run() {
    try {
      const {flags} = this.parse(SessionsPerPoint)
      axios.defaults.headers.common['X-OBSERVATORY-AUTH'] = flags.apikey
      let status
      if (flags.format === 'csv') {
        status = await axios.get(`${config.BASE_URL}/SessionsPerPoint/${flags.point}/${flags.datefrom}/${flags.dateto}/csv`)
      } else {
        status = await axios.get(`${config.BASE_URL}/SessionsPerPoint/${flags.point}/${flags.datefrom}/${flags.dateto}`)
      }
      console.log(status.data)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

SessionsPerPoint.flags = {
  format: flags.string({
    options: ['json', 'csv'],
    required: true,
    default: 'json',
  }),
  apikey: flags.string({
    required: true,
    description: 'the api key used for authorization',
  }),
  point: flags.string({
    required: true,
    description: 'the id of the point to search',
  }),
  datefrom: flags.string({
    required: true,
  }),
  dateto: flags.string({
    required: true,
  }),
}

SessionsPerPoint.description = 'return  info about the charging sessions on a certain point'

module.exports = SessionsPerPoint
