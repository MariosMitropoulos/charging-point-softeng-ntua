const express = require('express')
const router = express.Router()
const AuthService = require('../services/authService')

const authService = new AuthService()
const userAuth = authService.verifyUser
const stationAuth = authService.verifyStationOwner

const userLogin = require('../services/userLogin')
router.post('/login', userLogin)

const userLogout = require('../services/userLogout')
router.post('/logout', userAuth, userLogout)

const admin = require('./admin')
router.use('/admin', admin)

const stationmod = require('./stationmod.js')
router.use('/stationmod', stationmod)

const sessions = require('./sessions.js')
router.use('', sessions)

const queriesAux = require('./queriesAux.js')
router.use('/queries', queriesAux)

const point = require('./point.js')
router.use('/point', stationAuth, point)

module.exports = router
