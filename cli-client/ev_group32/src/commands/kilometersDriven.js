/* eslint-disable unicorn/filename-case */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable node/no-unpublished-require */
const {Command, flags} = require('@oclif/command')

const https = require('https')
const axios = require('axios')
const chalk = require('chalk')
const config = require('config')
axios.defaults.httpsAgent = new https.Agent()

class kilometersDriven extends Command {
  async run() {
    try {
      const {flags} = this.parse(kilometersDriven)
      axios.defaults.headers.common['X-OBSERVATORY-AUTH'] = flags.apikey
      let data
      if (flags.format === 'csv') {
        data = await axios.get(`${config.BASE_URL}/KilometersDriven/${flags.ev}/${flags.sessionStart}/${flags.sessionEnd}/csv`)
      } else {
        data = await axios.get(`${config.BASE_URL}/KilometersDriven/${flags.ev}/${flags.sessionStart}/${flags.sessionEnd}`)
      }
      if (data.data.result < 0) {
        console.log(chalk.red('session start is newer than session end'))
      } else {
        console.log(data.data)
      }
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

kilometersDriven.flags = {
  format: flags.string({
    options: ['json', 'csv'],
    required: true,
    default: 'json',
  }),
  apikey: flags.string({
    required: true,
    description: 'the api key used for authorization',
  }),
  ev: flags.string({
    required: true,
    description: 'the id of the car to search',
  }),
  sessionStart: flags.string({
    required: true,
    description: 'the starting session',
  }),
  sessionEnd: flags.string({
    required: true,
    description: 'the last session',
  }),
}

kilometersDriven.description = 'get kilometers driven between two sessions'

module.exports = kilometersDriven
