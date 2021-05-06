import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { makeStyles } from '@material-ui/styles'
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Switch,
  CircularProgress,
  Box,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import { useTodoList, updateTodoList } from '../helpers/fetcher'
import update from 'immutability-helper'

const useStyles = makeStyles({
  card: {
    margin: '1rem',
  },
  todoLine: {
    display: 'flex',
    alignItems: 'center',
  },
  textField: {
    flexGrow: 1,
  },
  standardSpace: {
    margin: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
})

const ToDoListForm = ({ toDoListId }) => {
  const classes = useStyles()
  const {
    todoList,
    isLoading: todolistLoading,
    isError: todoListError,
    mutate,
  } = useTodoList(toDoListId)

  const [todoState, setTodoState] = useState([])
  useEffect(() => {
    setTodoState(todoList?.todos)
  }, [todoList])
  const handleSubmit = async (event) => {
    event.preventDefault()
    await updateTodoList(toDoListId, {
      ...todoList,
      todos: todoState,
    })

    mutate({
      ...todoList,
      todos: todoState,
    })
  }
  if (todoListError) return <p>Error...</p>
  if (todolistLoading)
    return (
      <Box margin={5}>
        <CircularProgress color="secondary" />
      </Box>
    )

  const onChange = async (update) => {
    await updateTodoList(toDoListId, {
      ...todoList,
      todos: update,
    })

    mutate({
      ...todoList,
      todos: update,
    })
  }

  const debounceOnChange = _.debounce(onChange, 300)
  const percentageDone =
    Math.ceil(
      (todoList?.todos?.filter((item) => item.done).length /
        todoList?.todos?.length) *
        100
    ) || 0
  return (
    <Card className={classes.card}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography component="h2">{todoList?.name}</Typography>

          <Box position="relative" display="inline-flex">
            <CircularProgress variant="determinate" value={percentageDone} />
            <Box
              top={0}
              left={0}
              bottom={0}
              right={0}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="caption"
                component="div"
                color="textSecondary"
              >{`${percentageDone}%`}</Typography>
            </Box>
          </Box>
        </Box>
        <form onSubmit={handleSubmit} className={classes.form}>
          {todoState?.map((todo, index) => {
            return (
              <div key={index} className={classes.todoLine}>
                <Typography className={classes.standardSpace} variant="h6">
                  {index + 1}
                </Typography>

                <TextField
                  label="What to do?"
                  value={todo.name}
                  onChange={(event) => {
                    setTodoState([
                      // immutable update
                      ...todoState.slice(0, index),
                      { ...todo, name: event.target.value },
                      ...todoState.slice(index + 1),
                    ])
                    debounceOnChange([
                      // immutable update
                      ...todoState.slice(0, index),
                      { ...todo, name: event.target.value },
                      ...todoState.slice(index + 1),
                    ])
                  }}
                  className={classes.textField}
                />

                <Switch
                  checked={todo.done}
                  onChange={async () => {
                    const newTodos = update(todoList.todos, {
                      [index]: { done: { $set: !todo.done } },
                    })

                    await updateTodoList(toDoListId, {
                      ...todoList,
                      todos: newTodos,
                    })

                    mutate({ ...todoList, todos: newTodos })
                  }}
                  color="primary"
                  name="checkedB"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                <Button
                  size="small"
                  color="secondary"
                  className={classes.standardSpace}
                  onClick={async () => {
                    // Test lodash with useSWR mutation
                    const newTodos = _.filter(
                      todoList.todos,
                      (item) => item._id !== todo._id
                    )
                    await updateTodoList(toDoListId, {
                      ...todoList,
                      todos: newTodos,
                    })

                    mutate({
                      ...todoList,
                      todos: newTodos,
                    })
                  }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            )
          })}
          {todoState && (
            <CardActions>
              <Button
                type="button"
                color="primary"
                onClick={() => {
                  // Just local state update
                  setTodoState([...todoState, { name: '', done: false }])
                }}
              >
                Add Todo <AddIcon />
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </CardActions>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default ToDoListForm
