/* eslint-disable unicorn/filename-case */
/* eslint-disable no-console */
/* eslint-disable node/no-unpublished-require */
const {Command, flags} = require('@oclif/command')

const https = require('https')
const axios = require('axios')
const chalk = require('chalk')
require('dotenv').config()

axios.defaults.httpsAgent = new https.Agent()

class estimatedTimeAndCost extends Command {
  async run() {
    try {
      const {flags} = this.parse(estimatedTimeAndCost)
      const status = await axios.get(`${process.env.BASE_URL}/estimatedTimeAndCost/${flags.ev}/${flags.capacity}/${flags.mode}`)
      console.log(status.data)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

estimatedTimeAndCost.flags = {
  format: flags.string({
    options: ['json', 'csv'],
    required: true,
    default: 'json',
  }),
  ev: flags.string({
    required: true,
    description: 'the id of the car to search',
  }),
  capacity: flags.string({
    required: true,
    description: 'the current capacity of the car',
  }),
  mode: flags.string({
    required: true,
    description: 'the charge mode',
  }),
}

estimatedTimeAndCost.description = 'return the estimated time for the car to charge'

module.exports = estimatedTimeAndCost
