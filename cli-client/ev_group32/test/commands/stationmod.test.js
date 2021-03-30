/* eslint-disable camelcase */
/* eslint-disable node/no-unsupported-features/node-builtins */

const {expect} = require('@oclif/test')
const {exec} = require('child_process')
const util = require('util')
const execProm = util.promisify(exec)
const Station = require('../../../../back-end/api/models/Station')
const User = require('../../../../back-end/api/models/User')

const fs = require('fs')
const __homedir = require('os').homedir()

require('../testserver')

async function runShellCommand(command) {
  let result
  try {
    result = await execProm(command)
  } catch (error) {
    result = error
  }
  if (Error[Symbol.hasInstance](result))
    return

  return result
}

describe('stations', () => {
  describe('addReview',  () => {
    it('it adds a review in the db', async () => {
      const user = await User.findOne()
      const station = await Station.findOne()
      const res = await runShellCommand(`ev_group32 addReview --user ${user._id} --station ${station._id} --rating 5 --comment 'Excellent!' --date 20191021 --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stdout).to.contain('name')
      expect(res.stdout).to.contain('contact_info')
      expect(res.stdout).to.contain('points')
      expect(res.stdout).to.contain('operator')
      expect(res.stdout).to.contain('energy_provider')
      expect(res.stdout).to.contain('reviews')
      expect(res.stdout).to.contain('address')
      expect(res.stdout).to.contain('added')
    })
  })
  describe('addStation',  () => {
    it('it adds a station in the db', async () => {
      const user = await User.findOne({account_type: 'stationOwner'})
      const energyProv = await User.findOne({account_type: 'electricalCompanyOperator'})
      const res = await runShellCommand(`ev_group32 addStation --user ${user._id} --stationName '54 Vincenzo Island, Robelton' --address '242 Brycen Mews, East Ansel' --energyProvider ${energyProv._id} --operator Tamara.Pagac69 --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stdout).to.contain('name')
      expect(res.stdout).to.contain('contact_info')
      expect(res.stdout).to.contain('points')
      expect(res.stdout).to.contain('_id')
      expect(res.stdout).to.contain('address')
      expect(res.stdout).to.contain('operator')
      expect(res.stdout).to.contain('energy_provider')
      expect(res.stdout).to.contain('reviews')
    })
    it('it adds a station in the db - only name given', async () => {
      const user = await User.findOne({account_type: 'stationOwner'})
      const res = await runShellCommand(`ev_group32 addStation --user ${user._id} --stationName '54 Vincenzo Island, Robelton' --address '242 Brycen Mews, East Ansel' --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stderr).to.equal('Error: Missing required flag:\n --operator OPERATOR  the operator of the station to be added\nSee more help with --help\n')
    })
    it('it adds a station in the db - only operator given', async () => {
      const res = await runShellCommand(`ev_group32 addStation --stationName '54 Vincenzo Island, Robelton' --address '242 Brycen Mews, East Ansel' --operator Tamara.Pagac69 --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stderr).to.equal('Error: Missing required flag:\n --user USER  the user that has the station\nSee more help with --help\n')
    })
    it('it adds a station in the db - only energyProvider given', async () => {
      const energyProv = await User.findOne({account_type: 'electricalCompanyOperator'})
      const res = await runShellCommand(`ev_group32 addStation --stationName '54 Vincenzo Island, Robelton' --address '242 Brycen Mews, East Ansel' --energyProvider ${energyProv._id} --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stderr).to.equal('Error: Missing required flag:\n --user USER  the user that has the station\nSee more help with --help\n')
    })
  })
  describe('editStation',  () => {
    it('it edits a station in the db', async () => {
      const station = await Station.findOne()
      const stationOwner = await User.findOne({'stations.info': station._id})
      const energyProv = await User.findOne({account_type: 'electricalCompanyOperator'})
      const res = await runShellCommand(`ev_group32 editStation --station ${station._id} --stationName '54 Vincenzo Island, Robelton' --address '242 Brycen Mews, East Ansel' --energyProvider ${energyProv._id} --operator Tamara.Pagac69 --user ${stationOwner._id} --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stdout).to.contain('name')
      expect(res.stdout).to.contain('energy_provider')
      expect(res.stdout).to.contain('_id')
    })
    it('it edits a station in the db - not right owner', async () => {
      const station = await Station.findOne()
      const user = await User.findOne({account_type: 'vehicleOwner'})
      const energyProv = await User.findOne({account_type: 'electricalCompanyOperator'})
      const res = await runShellCommand(`ev_group32 editStation --station ${station._id} --stationName '54 Vincenzo Island, Robelton' --address '242 Brycen Mews, East Ansel' --energyProvider ${energyProv._id} --operator Tamara.Pagac69 --user ${user._id} --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stderr).to.equal('Error: Request failed with status code 401\n')
    })
  })
  describe('deleteStation',  () => {
    it('it deletes a station in the db', async () => {
      const station = await Station.findOne()
      const stationOwner = await User.findOne({'stations.info': station._id})
      const res = await runShellCommand(`ev_group32 deleteStation --station ${station._id} --user ${stationOwner._id} --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stdout).to.equal('{ deleted: true }\n')
    })
    it('it deletes a station in the db - not right owner', async () => {
      const station = await Station.findOne()
      const user = await User.findOne({account_type: 'vehicleOwner'})
      const res = await runShellCommand(`ev_group32 deleteStation --station ${station._id} --user ${user._id} --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stderr).to.equal('Error: Request failed with status code 401\n')
    })
  })
})

describe('logout', () => {
  it('logout for current user', () => {
    exec(`ev_group32 logout --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
      {encoding: 'utf8', flag: 'r'})}`, (error, stdout) => {
      expect(stdout).to.equal('Successful logout!\n')
    })
  })
})
