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

class addReview extends Command {
  async run() {
    try {
      const {flags} = this.parse(addReview)
      const params = new URLSearchParams()
      params.append('date', flags.date)
      params.append('by', flags.user)
      params.append('rating', flags.rating)
      params.append('comment', flags.comment)
      axios.defaults.headers.common['X-OBSERVATORY-AUTH'] = flags.apikey
      let status
      if (flags.format === 'csv') {
        status = await axios.post(`${config.BASE_URL}/stationmod/addreview/${flags.user}/${flags.station}/csv`,  params, {headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }})
      } else {
        status = await axios.post(`${config.BASE_URL}/stationmod/addreview/${flags.user}/${flags.station}`,  params, {headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }})
      }
      console.log(status.data)
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

addReview.flags = {
  format: flags.string({
    options: ['json', 'csv'],
    required: true,
    default: 'json',
  }),
  user: flags.string({
    required: true,
    description: 'the user that writes the review',
  }),
  station: flags.string({
    required: true,
    description: 'the station to add the review to',
  }),
  date: flags.string({
    required: true,
    description: 'the date that the review has been made',
  }),
  rating: flags.integer({
    required: true,
    description: 'the rating for the station',
  }),
  apikey: flags.string({
    required: true,
    description: 'the api key used for authorization',
  }),
  comment: flags.string({
    required: true,
    description: 'extra comments for the review',
  }),
}

addReview.description = 'add a review to a station'

module.exports = addReview
