const express = require('express')
const app = express()
const port = 3000

const storiesRoute = require('./routes/stories')
const usersRoute = require('./routes/users')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`)
    next()
})

app.use('/stories', storiesRoute)
app.use('/users', usersRoute)

app.get('/', (req, res) => {
  res.send('Welcom to api.czwang.link')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})