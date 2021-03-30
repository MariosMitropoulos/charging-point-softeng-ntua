const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    minLength: 1,
    maxLength: 255,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 59,
    maxLength: 60
  },
  contact_info: {
    email: {
      type: String,
      minLength: 5,
      maxLength: 255
    },
    phone: [{
      type: String
    }],
    website: {
      type: String,
      maxLength: 2000
    }
  },
  address: {
    type: String,
    minLength: 1,
    maxLength: 255
  },
  api_key: {
    type: String,
    minLength: 5
  },
  account_type: {
    type: String,
    enum: ['admin', 'vehicleOwner', 'stationOwner', 'bankOperator', 'electricalCompanyOperator'],
    default: 'vehicleOwner'
  },

  // for vehicle owner
  cars: [
    {
      model: {
        type: String
      },
      info: {
        type: mongoose.Types.ObjectId,
        ref: 'Vehicle'
      }
    }
  ],

  payment_card: [
    {
      owner: {
        type: String,
        minLength: 1,
        maxLength: 255,
        required: true
      },
      number: {
        type: String,
        MaxLength: 20,
        required: true
      },
      cvv: {
        type: String,
        minLength: 3,
        required: true
      },
      exp_date: {
        type: String,
        minLength: 5,
        maxLength: 5,
        required: true
      }
    }
  ],

  // for stationOwner
  stations: [
    {
      name: {
        type: String,
        minLength: 1,
        maxLength: 255
      },
      info: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Station'
      }
    }
  ],

  // for electricalCompanyOperator
  cost_per_kwh: Number,
  electricalCompanyOperatorSessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    }
  ]
})

const model = mongoose.model('User', UserSchema)
module.exports = model
