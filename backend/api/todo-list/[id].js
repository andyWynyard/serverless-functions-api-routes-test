const dbConnect = require('../../utils/dbConnect')
const { TodoList } = require('../../models')
const { DELETE, PUT, GET } = require('../../utils/constants')

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

  const {
    method,
    query: { id },
  } = req

  switch (method) {
    case GET:
      try {
        const todoList = await TodoList.findById(id)
        res.status(200).json({ success: true, data: todoList })
      } catch (error) {
        res.status(500).json({ success: false, error: error.message })
      }
      break
    case PUT:
      try {
        const updatedTodoList = await TodoList.findByIdAndUpdate(id, req.body, {
          new: true,
        })
        res.status(201).json({ success: true, data: updatedTodoList })
      } catch (error) {
        res.status(400).json({ success: false, error: error.message })
      }
      break
    case DELETE:
      try {
        const deletedList = await TodoList.findByIdAndDelete(id)
        res.status(201).json({ success: true, data: deletedList })
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
