const mongoose = require('mongoose')
const flatten = require('flat')
const { parse } = require('json2csv')

function preClean (object) {
  if (object.length === 1) { object = object[0] }
  Object
    .entries(object)
    .forEach(([k, v]) => {
      if (k === '_id' || (typeof v === 'object' && mongoose.Types.ObjectId.isValid(v))) {
        object[k] = v.toString()
      }
      if (v && typeof v === 'object') {
        preClean(v)
      }
      if ((v && typeof v === 'object' && !Object.keys(v).length) || v === null || v === undefined) {
        if (Array.isArray(object)) {
          object.splice(k, 1)
        } else {
          delete object[k]
        }
      }
    })
  return object
}

async function afterClean (data) {
  for (const key in data) {
    if (key.startsWith('$__')) {
      delete data[key]
    }
  }
  if ('isNew' in data) delete data.isNew
  if ('$init' in data) delete data.$init
  const str = JSON.stringify(data)
  const newstr = await str.replace(/_doc./g, '')
  const rst = await JSON.parse(newstr)
  return rst
}

module.exports = async (req, res, next) => {
  const data = res.locals.data
  if (req.params.format === 'csv') {
    try {
      const flat = await flatten(preClean(data))
      const output = await afterClean(flat)

      const csv = parse(output)
      res.attachment('result.csv')
      res.send(csv)
    } catch (err) {
      console.error(err)
    }
  } else { res.send(data) }
}
