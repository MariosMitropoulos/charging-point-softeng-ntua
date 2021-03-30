/* eslint-disable node/no-unsupported-features/node-builtins */
/* eslint-disable unicorn/filename-case */
/* eslint-disable no-console */
/* eslint-disable node/no-unpublished-require */
const {Command, flags} = require('@oclif/command')

const https = require('https')
const axios = require('axios')
const chalk = require('chalk')
const config = require('config')

axios.defaults.httpsAgent = new https.Agent()

class addPoint extends Command {
  async run() {
    try {
      const {flags} = this.parse(addPoint)
      axios.defaults.headers.common['X-OBSERVATORY-AUTH'] = flags.apikey
      let status
      if (flags.format === 'csv') {
        status = await axios.post(`${config.BASE_URL}/point/add/${flags.station}/csv`)
      } else {
        status = await axios.post(`${config.BASE_URL}/point/add/${flags.station}`)
      }
      console.log(status.data)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

addPoint.flags = {
  format: flags.string({
    options: ['json', 'csv'],
    required: true,
    default: 'json',
  }),
  apikey: flags.string({
    description: 'the api key used for authorization',
  }),
  station: flags.string({
    required: true,
    description: 'the id of the station',
  }),
}

addPoint.description = 'add a new point to a station'

module.exports = addPoint
