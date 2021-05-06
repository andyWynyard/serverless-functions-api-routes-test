const mongoose = require('mongoose')
const { Schema } = mongoose

const TodoListSchema = new Schema(
  {
    name: { type: String, required: true, default: '' },
    todos: [{ name: String, done: Boolean }],
  },
  { collection: 'todoList' }
)

module.exports = mongoose.model('TodoList', TodoListSchema)
