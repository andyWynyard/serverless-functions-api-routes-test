const mongoose = require('mongoose')
const { Schema } = mongoose

const TodoSchema = new Schema(
  {
    description: { type: String, required: true, default: '' },
    done: { type: Boolean, required: true, default: false },
  },
  { collection: 'todos' }
)

module.exports = mongoose.model('Todo', TodoSchema)
