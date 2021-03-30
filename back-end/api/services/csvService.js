const mongoose = require('mongoose')
const csv = require('csvtojson')
const Session = require('../models/Session')
const pointModel = require('../models/Point')
const vehicleModel = require('../models/Vehicle')
const userModel = require('../models/User')

const upload = async (req, res, next) => {
  if (req.file[0] === undefined) {
    return res.status(400).send('Please upload a csv file!')
  }
  csv()
    .fromFile(req.file[0].path)
    .then(function (jsonArrayObj) {
      Session.insertMany(jsonArrayObj, (err) => {
        if (err) {
          res.status(400).send(err)
        } else {
          // change linked data
          for (let i = 0; i < jsonArrayObj.length; i++) {
            pointModel.findByIdAndUpdate(jsonArrayObj[i].point, { $push: { sessions: mongoose.Types.ObjectId(jsonArrayObj[i]._id) } }, (err) => {
              if (err) console.log(err)
            })
            vehicleModel.findByIdAndUpdate(jsonArrayObj[i].car, { $push: { sessions: mongoose.Types.ObjectId(jsonArrayObj[i]._id) } }, (err) => {
              if (err) console.log(err)
            })
            userModel.findByIdAndUpdate(jsonArrayObj[i].energy_provider_used, { $push: { electricalCompanyOperatorSessions: mongoose.Types.ObjectId(jsonArrayObj[i]._id) } }, (err) => {
              if (err) console.log(err)
            })
          }
          Session.find()
            .then(data => {
              res.locals.data = {
                SessionsInUploadedFile: jsonArrayObj.length,
                SessionsImported: jsonArrayObj.length,
                TotalSessionsInDatabase: data.length
              }
              return next()
            })
        }
      })
    })
}
module.exports = upload
