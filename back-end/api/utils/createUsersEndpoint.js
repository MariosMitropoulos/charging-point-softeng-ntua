const createUsers = require('./createUsers')

module.exports = async (req, res) => {
  try {
    await createUsers()
    res.send({ status: 'OK' })
  } catch (err) {
    console.log(err)
    res.status(400)
    res.send({ status: 'failed' })
  }
}
