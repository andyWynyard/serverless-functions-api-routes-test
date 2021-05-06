const dbConnect = require('../../utils/dbConnect')
const { TodoList } = require('../../models')
const { GET, POST } = require('../../utils/constants')

dbConnect()

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  const { method, body } = req
  switch (method) {
    case GET:
      try {
        const todoLists = await TodoList.find()
        res.status(200).json({ success: true, data: todoLists })
      } catch (error) {
        res.status(400).json({ success: false, error: error.message })
      }

      break
    case POST:
      try {
        const newList = await TodoList.create(body)
        res.status(201).json({ success: true, data: newList })
      } catch (error) {
        res.status(400).json({ success: false, error: error.message })
      }

      break
    default:
      {
        res.status(405).json({ success: false })
      }
      break
  }
}
