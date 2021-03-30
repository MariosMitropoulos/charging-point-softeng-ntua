/* eslint-disable unicorn/filename-case */
/* eslint-disable no-console */
/* eslint-disable node/no-unpublished-require */
const {Command, flags} = require('@oclif/command')

const https = require('https')
const axios = require('axios')
const chalk = require('chalk')
const config = require('config')

axios.defaults.httpsAgent = new https.Agent()

class chargingPercentage extends Command {
  async run() {
    try {
      const {flags} = this.parse(chargingPercentage)
      axios.defaults.headers.common['X-OBSERVATORY-AUTH'] = flags.apikey
      let status
      if (flags.format === 'csv') {
        status = await axios.get(`${config.BASE_URL}/ChargingPercentage/${flags.ev}/${flags.capacity}/csv`)
      } else {
        status = await axios.get(`${config.BASE_URL}/ChargingPercentage/${flags.ev}/${flags.capacity}`)
      }
      console.log(status.data)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

chargingPercentage.flags = {
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
    description: 'the vehicle to search for',
  }),
  capacity: flags.string({
    required: true,
    description: 'the current capacity of the car\'s battery',
  }),
}

chargingPercentage.description = 'return the charging percentage in the given point'

module.exports = chargingPercentage
