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

class editStation extends Command {
  async run() {
    try {
      const {flags} = this.parse(editStation)
      const params = new URLSearchParams()
      params.append('name', flags.stationName)
      params.append('address', flags.address)
      params.append('operator', flags.operator)
      params.append('energy_provider', flags.energyProvider)

      axios.defaults.headers.common['X-OBSERVATORY-AUTH'] = flags.apikey
      let status
      if (flags.format === 'csv') {
        status = await axios.post(`${config.BASE_URL}/stationmod/edit/${flags.user}/${flags.station}/csv`,  params, {headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }})
      } else {
        status = await axios.post(`${config.BASE_URL}/stationmod/edit/${flags.user}/${flags.station}`,  params, {headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }})
      }
      console.log(status.data)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

editStation.flags = {
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
  stationName: flags.string({
    required: true,
    description: 'the name of the station to be added',
  }),
  address: flags.string({
    required: true,
    description: 'the address of the station to be added',
  }),
  operator: flags.string({
    required: true,
    description: 'the operator of the station to be added',
  }),
  energyProvider: flags.string({
    required: true,
    description: 'the energy provider for the station to be adde',
  }),
}

editStation.description = 'add a new station'

module.exports = editStation
