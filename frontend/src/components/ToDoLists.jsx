import React, { useState } from 'react'
import _ from 'lodash'
import {
  Card,
  ListItemText,
  CircularProgress,
  ListItemIcon,
  Typography,
  ListItem,
  List,
  CardContent,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core'

// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';

import { Receipt, Delete } from '@material-ui/icons'
import ToDoListForm from './ToDoListForm'
import {
  useTodoLists,
  deleteTodoList,
  createTodoList,
} from '../helpers/fetcher'

// Keep for example from inital
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
// const getPersonalTodos = () => {
//   return sleep(1000).then(() =>
//     Promise.resolve({
//       '0000000001': {
//         id: '0000000001',
//         title: 'First List',
//         todos: ['First todo of first list!'],
//       },
//       '0000000002': {
//         id: '0000000002',
//         title: 'Second List',
//         todos: ['First todo of second list!'],
//       },
//     })
//   )
// }

const ToDoLists = ({ style }) => {
  const {
    todoLists,
    isLoading: todolistsLoading,
    isError: todoListsError,
    mutate,
  } = useTodoLists()
  const [activeList, setActiveList] = useState()
  const [open, setOpen] = React.useState(false)
  const [newListName, setNewListName] = useState('')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async () => {
    await createTodoList({ name: newListName })
    handleClose()
    setNewListName('')
    mutate({ data: [...todoLists, { name: newListName, todos: [] }] })
  }

  if (todoListsError) return <p>{JSON.stringify(todoListsError)}</p>
  if (todolistsLoading)
    return (
      <Box margin={5}>
        <CircularProgress color="secondary" />
      </Box>
    )
  return (
    <>
      <Card style={style}>
        <CardContent>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography component="h2">My ToDo Lists</Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClickOpen}
            >
              Create New Todo List
            </Button>
          </Box>
          <List>
            {todoLists &&
              Object.keys(todoLists).map((key) => {
                return (
                  <Box
                    key={key}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <ListItem button onClick={() => setActiveList(key)}>
                      <ListItemIcon>
                        <Receipt
                          style={{
                            color:
                              todoLists[activeList]?._id === todoLists[key]?._id
                                ? 'rebeccapurple'
                                : '',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText primary={todoLists[key].name} />
                    </ListItem>

                    <Button
                      size="small"
                      color="secondary"
                      onClick={async () => {
                        // Test lodash with useSWR mutation
                        const newTodosLists = _.filter(
                          todoLists,
                          (item) => item._id !== todoLists[key]._id
                        )
                        await deleteTodoList(todoLists[key]._id)
                        mutate({ data: newTodosLists })
                      }}
                    >
                      <Delete />
                    </Button>
                  </Box>
                )
              })}
          </List>
        </CardContent>
      </Card>
      {todoLists[activeList] && (
        <ToDoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          toDoListId={todoLists[activeList]._id}
        />
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create New List</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will create a new todo list with no todos.
          </DialogContentText>
          <TextField
            autoFocus
            label="Name Me"
            value={newListName}
            fullWidth
            onChange={(e) => setNewListName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ToDoLists
