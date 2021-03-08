/* eslint-disable unicorn/filename-case */
/* eslint-disable no-console */
/* eslint-disable node/no-unpublished-require */
const {Command, flags} = require('@oclif/command')

const https = require('https')
const axios = require('axios')
const chalk = require('chalk')
require('dotenv').config()

axios.defaults.httpsAgent = new https.Agent()

class periodicBill extends Command {
  async run() {
    try {
      const {flags} = this.parse(periodicBill)
      const status = await axios.get(`${process.env.BASE_URL}/periodicBill/${flags.ev}/${flags.datefrom}/${flags.dateto}`)
      console.log(status.data)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

periodicBill.flags = {
  format: flags.string({
    options: ['json', 'csv'],
    required: true,
    default: 'json',
  }),
  ev: flags.string({
    required: true,
    description: 'the id of the car to search',
  }),
  datefrom: flags.string({
    required: true,
  }),
  dateto: flags.string({
    required: true,
  }),
}

periodicBill.description = 'return total bill for all charging sessions in a certain period'

module.exports = periodicBill
