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

class deleteStation extends Command {
  async run() {
    try {
      const {flags} = this.parse(deleteStation)

      axios.defaults.headers.common['X-OBSERVATORY-AUTH'] = flags.apikey
      let status
      if (flags.format === 'csv') {
        status = await axios.post(`${config.BASE_URL}/stationmod/delete/${flags.user}/${flags.station}/csv`)
      } else {
        status = await axios.post(`${config.BASE_URL}/stationmod/delete/${flags.user}/${flags.station}`)
      }
      console.log(status.data)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

deleteStation.flags = {
  format: flags.string({
    options: ['json', 'csv'],
    required: true,
    default: 'json',
  }),
  user: flags.string({
    required: true,
    description: 'the id of user that has the station',
  }),
  station: flags.string({
    required: true,
    description: 'the id of the station to be modified',
  }),
  apikey: flags.string({
    description: 'the api key used for authorization',
  }),
}

deleteStation.description = 'add a new station'

module.exports = deleteStation
