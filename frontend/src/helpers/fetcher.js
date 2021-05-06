import axios from 'axios'

import useSWR from 'swr'

const URI =
  process.env.NODE_ENV === 'production'
    ? 'https://fullstack-sandbox.vercel.app/api'
    : 'http://localhost:3010/api'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export const useTodoLists = () => {
  const { data, error, mutate } = useSWR(`${URI}/todo-list`, fetcher)
  return {
    todoLists: data?.data,
    isLoading: !data && !error,
    isError: error || data?.success === false,
    mutate,
  }
}
export const useTodoList = (toDoListId) => {
  const { data, error, mutate } = useSWR(
    `${URI}/todo-list/${toDoListId}`,
    fetcher
  )
  return {
    todoList: data?.data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  }
}

export const updateTodoList = async (todoListId, data) => {
  const updatedTodo = await axios.put(`${URI}/todo-list/${todoListId}`, data)
  return updatedTodo
}

export const createTodoList = async (data) => {
  const updated = await axios.post(`${URI}/todo-list`, data)
  return updated
}

export const deleteTodoList = async (todoListId) => {
  const deletedTodoList = await axios.delete(`${URI}/todo-list/${todoListId}`)
  return deletedTodoList
}
