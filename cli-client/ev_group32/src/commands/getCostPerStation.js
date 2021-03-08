/* eslint-disable unicorn/filename-case */
/* eslint-disable no-console */
/* eslint-disable node/no-unpublished-require */
const {Command, flags} = require('@oclif/command')

const https = require('https')
const axios = require('axios')
const chalk = require('chalk')
const config = require('config')

axios.defaults.httpsAgent = new https.Agent()

class getCostPerStation extends Command {
  async run() {
    try {
      const {flags} = this.parse(getCostPerStation)
      const status = await axios.get(`${config.BASE_URL}/CostPerStation/${flags.station}/${flags.datefrom}/${flags.dateto}`)
      console.log(status.data)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

getCostPerStation.flags = {
  format: flags.string({
    options: ['json', 'csv'],
    required: true,
    default: 'json',
  }),
  station: flags.string({
    required: true,
  }),
  datefrom: flags.string({
    required: true,
  }),
  dateto: flags.string({
    required: true,
  }),
}

getCostPerStation.description = 'return total bill for the station in a certain period'

module.exports = getCostPerStation
