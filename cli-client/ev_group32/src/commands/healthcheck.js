/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable node/no-unpublished-require */
const {Command, flags} = require('@oclif/command')

const https = require('https')
const axios = require('axios')
const chalk = require('chalk')
const config = require('config')
axios.defaults.httpsAgent = new https.Agent()

class HealthCheck extends Command {
  async run() {
    try {
      const {flags} = this.parse(HealthCheck)
      let status
      if (flags.format === 'csv') {
        status = await axios.get(`${config.BASE_URL}/admin/healthcheck/csv`)
      } else {
        status = await axios.get(`${config.BASE_URL}/admin/healthcheck`)
      }
      console.log(status.data)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

HealthCheck.flags = {
  format: flags.string({
    options: ['json', 'csv'],
    required: true,
    default: 'json',
  }),
}

HealthCheck.description = 'tests live server for errors'

module.exports = HealthCheck
