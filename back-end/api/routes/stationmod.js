const express = require('express')
const router = express.Router()
const AuthService = require('../services/authService')

const authService = new AuthService()
const vehicleOwnerAuth = authService.verifyVehicleOwner
const stationOwnerAuth = authService.verifyStationOwner

const StationEndpoint = require('../services/stationEndpoint')
const stationEndpoint = new StationEndpoint()

const csvjson = require('../services/JSONToCSV')

router.post('/addreview/:userId/:stationId/:format?', vehicleOwnerAuth, stationEndpoint.addReview, csvjson)

router.post('/add/:userId/:format?', stationOwnerAuth, stationEndpoint.addStation, csvjson)

router.post('/edit/:userId/:stationId/:format?', stationOwnerAuth, stationEndpoint.editStation, csvjson)

router.post('/delete/:userId/:stationId/:format?', stationOwnerAuth, stationEndpoint.deleteStation, csvjson)

module.exports = router
