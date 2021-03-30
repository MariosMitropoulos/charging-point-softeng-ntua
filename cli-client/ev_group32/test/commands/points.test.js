/* eslint-disable camelcase */
/* eslint-disable node/no-unsupported-features/node-builtins */

const {expect} = require('@oclif/test')
const {exec} = require('child_process')
const util = require('util')
const execProm = util.promisify(exec)
const Station = require('../../../../back-end/api/models/Station')

const fs = require('fs')
const Point = require('../../../../back-end/api/models/Point')
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

describe('points', () => {
  describe('addPoint',  () => {
    it('it adds a point in the db', async () => {
      const station = await Station.findOne()
      const res = await runShellCommand(`ev_group32 addPoint --station ${station._id} --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stdout).to.contain('sessions')
      expect(res.stdout).to.contain('_id')
      expect(res.stdout).to.contain('station')
      expect(res.stdout).to.contain('total_energy_delivered')
    })
    it('it adds a point in the db - no apikey', async () => {
      const station = await Station.findOne()
      const res = await runShellCommand(`ev_group32 addPoint --station ${station._id}`)
      expect(res.stderr).to.equal('TypeError [ERR_HTTP_INVALID_HEADER_VALUE]: Invalid value "undefined" for header "X-OBSERVATORY-AUTH"\n')
    })
  })

  describe('getPoint',  () => {
    it('it searches for a point in the db', async () => {
      const point = await Point.findOne()
      const res = await runShellCommand(`ev_group32 getPoint --point ${point._id} --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stdout).to.contain('sessions')
      expect(res.stdout).to.contain('_id')
      expect(res.stdout).to.contain('station')
    })
    it('it searches for a point in the db - no apikey', async () => {
      const point = await Point.findOne()
      const res = await runShellCommand(`ev_group32 getPoint --point ${point._id}`)
      expect(res.stderr).to.equal('TypeError [ERR_HTTP_INVALID_HEADER_VALUE]: Invalid value "undefined" for header "X-OBSERVATORY-AUTH"\n')
    })
    it('it searches for a point in the db - wrong point', async () => {
      const res = await runShellCommand(`ev_group32 getPoint --point fdsa1 --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stderr).to.equal('Error: Request failed with status code 400\n')
    })
  })
  describe('deletePoint',  () => {
    it('it deletes a point', async () => {
      const point = await Point.findOne()
      const res = await runShellCommand(`ev_group32 deletePoint --point ${point._id} --apikey ${fs.readFileSync(__homedir + '/softeng20bAPI.token',
        {encoding: 'utf8', flag: 'r'})}`)
      expect(res.stdout).to.equal('{ result: \'OK\' }\n')
    })
  })
})
