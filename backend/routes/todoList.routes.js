const express = require('express')

const router = express.Router()

const { TodoList } = require('../models')

router.get('/', async (req, res) => {
  try {
    const todoLists = await TodoList.find()
    res.status(200).json(todoLists)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

router.get('/:todoListId', async (req, res) => {
  try {
    const todoList = await TodoList.findById(req.params.todoListId)
    res.status(200).json(todoList)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

router.post('/', async (req, res) => {
  try {
    const newList = new TodoList(req.body)
    const saved = await newList.save()
    res.status(200).json(saved)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

router.put('/:todoListId', async (req, res) => {
  try {
    const updatedTodoList = await TodoList.findByIdAndUpdate(
      req.params.todoListId,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedTodoList)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

router.delete('/:todoListId', async (req, res) => {
  try {
    const deletedList = await TodoList.findByIdAndDelete(req.params.todoListId)
    res.status(200).json(deletedList)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

module.exports = router
