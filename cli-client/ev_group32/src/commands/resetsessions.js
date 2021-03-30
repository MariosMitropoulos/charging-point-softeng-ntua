/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable node/no-unpublished-require */
const {Command, flags} = require('@oclif/command')

const https = require('https')
const axios = require('axios')
const chalk = require('chalk')
const config = require('config')
axios.defaults.httpsAgent = new https.Agent()

class resetSessions extends Command {
  async run() {
    try {
      const {flags} = this.parse(resetSessions)
      await axios.post(`${config.BASE_URL}/admin/resetsessions`)
      console.log('Reset Successful')
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

resetSessions.flags = {
  format: flags.string({
    options: ['json', 'csv'],
    required: true,
    default: 'json',
  }),
}

resetSessions.description = 'reset evcharge data and insert default admin to the db'

module.exports = resetSessions
