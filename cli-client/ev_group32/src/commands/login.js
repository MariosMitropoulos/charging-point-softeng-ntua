/* eslint-disable node/no-unsupported-features/node-builtins */
/* eslint-disable no-console */
/* eslint-disable node/no-unpublished-require */
const {Command, flags} = require('@oclif/command')

const fs = require('fs')
const https = require('https')
const axios = require('axios')
const chalk = require('chalk')
const config = require('config')
const __homedir = require('os').homedir()

axios.defaults.httpsAgent = new https.Agent()

class Login extends Command {
  async run() {
    try {
      const {flags} = this.parse(Login)
      const params = new URLSearchParams()
      params.append('username', flags.username)
      params.append('password', flags.passw)

      const status = await axios.post(`${config.BASE_URL}/login`, params, {headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }})
      fs.writeFileSync((__homedir + '/softeng20bAPI.token'), status.data.token)
      console.log('Successful login!')
    } catch (error) {
      console.error(chalk.red(error))
    }
  }
}

Login.flags = {
  username: flags.string({
    required: true,
    description: 'Your username',
  }),
  passw: flags.string({
    required: true,
    description: 'Your password',
  }),
}

Login.description = 'login to the server to get your api-key. On successful response, the api-key is saved on {home}/softeng20bAPI.token/'

module.exports = Login
