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

class deletePoint extends Command {
  async run() {
    try {
      const {flags} = this.parse(deletePoint)
      const params = new URLSearchParams()

      axios.defaults.headers.common['X-OBSERVATORY-AUTH'] = flags.apikey

      let status
      if (flags.format === 'csv') {
        status = await axios.post(`${config.BASE_URL}/point/delete/${flags.point}/csv`,  params, {headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }})
      } else {
        status = await axios.post(`${config.BASE_URL}/point/delete/${flags.point}`,  params, {headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }})
      }
      console.log(status.data)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

deletePoint.flags = {
  format: flags.string({
    options: ['json', 'csv'],
    required: true,
    default: 'json',
  }),
  apikey: flags.string({
    description: 'the api key used for authorization',
  }),
  point: flags.string({
    required: true,
    description: 'the id of the point to search',
  }),
}

deletePoint.description = 'get information about a station point'

module.exports = deletePoint
