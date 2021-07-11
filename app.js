const express = require('express')
const app = express()
const port = 3000

const storiesRoute = require('./routes/stories')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`)
    next()
})

app.use('/stories', storiesRoute)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})