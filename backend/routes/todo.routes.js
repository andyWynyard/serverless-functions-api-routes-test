const express = require('express')

const router = express.Router()

const { Todo } = require('../models')

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find()
    res.json(todos)
  } catch (error) {
    res.json({ message: error })
  }
})
router.get('/:todoId', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.todoId)
    res.status(200).json(todo)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})
router.post('/', async (req, res) => {
  const { description, done } = req.body
  const newTodo = new Todo({
    description,
    done,
  })
  try {
    const saved = await newTodo.save()
    res.json(saved)
  } catch (error) {
    res.json({ message: error })
  }
})

router.delete('/:todoId', async (req, res) => {
  try {
    const removedTodo = await Todo.findByIdAndDelete(req.params.todoId)
    res.json(removedTodo)
  } catch (error) {
    res.json({ message: error })
  }
})

router.put('/:todoId', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.todoId,
      req.body,
      { new: true }
    )
    res.json(updatedTodo)
  } catch (error) {
    res.json({ message: error })
  }
})

module.exports = router
