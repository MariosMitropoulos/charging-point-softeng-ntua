const express = require('express')
const router = express.Router()

const User = require('../services/userService')
const user = new User()

const AuthService = require('../services/authService')
const authService = new AuthService()
const verifyAdmin = authService.verifyAdmin

const upload = require('../services/csvService')
const multiparty = require('multiparty')

const resetsessions = require('../services/resetSessions')
router.post('/resetsessions', resetsessions)

const createUsers = require('../utils/createUsersEndpoint')
router.post('/createUsers', createUsers)

const createSessions = require('../utils/createSessions')
router.post('/createSessions/:dest?', createSessions)

const healthcheck = require('../services/healthcheck')
router.get('/healthcheck', healthcheck)

const csvjson = require('../services/JSONToCSV')
router.get('/users/:username/:format?', verifyAdmin, (req, res, next) => {
  user.getByUsername(req.params.username, (err, name) => {
    if (err) {
      res.status(400).send(err)
    } else {
      if (!Object.keys(name).length) {
        res.sendStatus(204)
      } else {
        res.locals.data = name
        return next()
      }
    }
  })
}, csvjson)

router.post('/usermod/:username/:password/:format?', verifyAdmin, async (req, res) => {
  await user.getByUsername(req.params.username, async (err, name) => {
    if (err) {
      res.status(400).send(err)
    } else if (!Object.keys(name).length) {
      await user.createUser({ username: req.params.username, password: req.params.password }, res)
    } else {
      await user.changeUserPassword(req.params.username, req.params.password)
      res.send('Changed user password')
    }
  })
})

router.post('/system/sessionsupd/:format?', (req, res, next) => {
  const form = new multiparty.Form()
  form.parse(req, function (err, fields, files) {
    if (err) {
      res.sendStatus(400)
    }
    upload(files, res, next)
  })
}, csvjson)

// BAD REQUESTS

router.post('/usermod', (req, res) => {
  res.status(400).send('Insert username and password')
})

router.post('/usermod/:username', (req, res) => {
  res.status(400).send('Insert username and password')
})
router.get('/users', (req, res) => {
  res.status(400).send('Insert a username')
})
module.exports = router
