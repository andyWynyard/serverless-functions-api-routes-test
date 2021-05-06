const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const keys = require('./config/keys')

const todoRoute = require('./routes/todo.routes')
const todoListRoute = require('./routes/todoList.routes')

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log('Database connected')
    },
    (error) => {
      console.error(`Database could not be connected ${error}`)
    }
  )

const app = express()

app.use(cors())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use('/todos', todoRoute)
app.use('/todo-list', todoListRoute)

const PORT = process.env.PORT || 3001

app.get('/', (req, res) =>
  res.send(
    'Welcome to the API for Andy testnig with node API deployments to Vercel. Its probs broken, so 🤷 '
  )
)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
