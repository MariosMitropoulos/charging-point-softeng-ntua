/* eslint-disable node/no-missing-require */
/* eslint-disable no-negated-condition */
/* eslint-disable no-console */
const {Command, flags} = require('@oclif/command')

const https = require('https')
const axios = require('axios')
const chalk = require('chalk')
const fs = require('fs')
const config = require('config')
const FormData = require('form-data')
axios.defaults.httpsAgent = new https.Agent()

class admin extends Command {
  async run() {
    try {
      const {flags} = this.parse(admin)

      if (flags.healthcheck !== undefined) {
        let status
        if (flags.format === 'csv') {
          status = await axios.get(`${config.BASE_URL}/admin/healthcheck/csv`)
        } else {
          status = await axios.get(`${config.BASE_URL}/admin/healthcheck`)
        }
        console.log(status.data)
      } else if (flags.resetsessions !== undefined) {
        await axios.post(`${config.BASE_URL}/admin/resetsessions`)

        console.log('Reset Successful')
      } else {
        axios.defaults.headers.common['X-OBSERVATORY-AUTH'] = flags.apikey

        if (flags.usermod !== undefined) {
          let status
          if (flags.format === 'csv') {
            status = await axios.post(`${config.BASE_URL}/admin/usermod/${flags.username}/${flags.passw}/csv`)
          } else {
            status = await axios.post(`${config.BASE_URL}/admin/usermod/${flags.username}/${flags.passw}`)
          }
          console.log(status.data)
        }
        if (flags.users !== undefined) {
          let status
          if (flags.format === 'csv') {
            status = await axios.get(`${config.BASE_URL}/admin/users/${flags.username}/csv`)
          } else {
            status = await axios.get(`${config.BASE_URL}/admin/users/${flags.username}`)
          }
          console.log({username: status.data[0].username, apikey: status.data[0].api_key})
        }
        if (flags.sessionsupd !== undefined) {
          const form = new FormData()
          form.append('file', fs.createReadStream(flags.source))

          let status
          if (flags.format === 'csv') {
            status = await axios.post(`${config.BASE_URL}/admin/system/sessionsupd/csv`, form, {headers: form.getHeaders()})
          } else {
            status = await axios.post(`${config.BASE_URL}/admin/system/sessionsupd`, form, {headers: form.getHeaders()})
          }
          console.log(status.data)
        }
      }
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

admin.flags = {
  usermod: {
    Boolean,
    description: 'insert a new user to the database or change an existing user\'s password. should be used with ' + chalk.reset('--username --passw'),
    exclusive: ['users', 'sessionsupd', 'source', 'healthcheck', 'resetsessions'],
    dependsOn: ['username', 'passw', 'format', 'apikey', 'format'],
  },
  username: flags.string({
    description: 'Your username',
  }),
  passw: flags.string({
    description: 'Your password',
  }),
  users: {
    Boolean,
    description: 'get details for a specific user. should be used with ' + chalk.reset('--username'),
    exclusive: ['usermod', 'sessionsupd', 'source', 'healthcheck', 'resetsessions', 'passw'],
    dependsOn: ['username', 'format', 'apikey', 'format'],
  },
  sessionsupd: {
    Boolean,
    exclusive: ['users', 'usermod', 'healthcheck', 'resetsessions', 'username', 'passw'],
    dependsOn: ['source', 'format', 'apikey', 'format'],
    description: 'upload charging session data to the database. should be used with ' + chalk.reset('--source'),
  },
  source: flags.string({
    dependsOn: ['sessionsupd'],
    description: 'the file to upload to the server. it can only be a csv file',
  }),
  healthcheck: {
    Boolean,
    exclusive: ['users', 'sessionsupd', 'source', 'usermod', 'resetsessions', 'username', 'password'],
    description: 'tests live server for errors',
  },
  resetsessions: {
    Boolean,
    exclusive: ['users', 'sessionsupd', 'source', 'healthcheck', 'usermod'],
    description: 'reset evcharge data and insert default admin to the db',
  },
  format: flags.string({
    options: ['json', 'csv'],
    default: 'json',
  }),
  apikey: flags.string({
    description: 'the api key used for authorization',
  }),
}

admin.description = 'system management calls'

module.exports = admin
