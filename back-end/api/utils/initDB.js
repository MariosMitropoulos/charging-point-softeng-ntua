const { connect } = require('mongoose')
const config = require('config')

module.exports = () => {
  const uri = config.DATABASE_URL

  connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
    .then(() => {
      console.log('Connection established with MongoDB')
    })
    .catch(error => console.error(error.message))
}
