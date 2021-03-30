const express = require('express')
const router = express.Router()

const PointEndpoint = require('../services/pointEndpoint')
const pointEndpoint = new PointEndpoint()

const csvjson = require('../services/JSONToCSV')

router.get('/get/:pointId/:format?', pointEndpoint.getPoint, csvjson)

router.post('/add/:stationId/:format?', pointEndpoint.addPoint, csvjson)

router.post('/delete/:pointId/:format?', pointEndpoint.removePoint, csvjson)

module.exports = router
