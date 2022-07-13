const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const toyService = require('./services/toy-service')
const app = express()
const port = process.env.PORT || 3030

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.use(cors())

// app.get('/', (req, res) => {
//   res.send('Please work?!')
// })

// list
app.get('/api/toy', (req, res) => {
  const filterBy = req.query
  console.log('filterBy', filterBy)
  toyService
    .query(filterBy)
    .then((toys) => {
      console.log('toys', toys)
      res.send(toys)
    })
    .catch((err) => res.status(500).send('Cannot get toys'))
})

// create
app.post('/api/toy', (req, res) => {
  const { name, price } = req.body
  const toy = {
    name,
    price,
    createdAt: Date.now(),
    inStock: true,
    reviews: ['review 1 best 1', 'review 2 almost 1', 'review 3 far from 1'],
    labels: ['Battery powered', 'Outdoor', 'On wheels'],
  }
  toyService
    .save(toy)
    .then((savedToy) => res.send(savedToy))
    .catch((err) => res.status(500).send('Cannot add toy'))
})

// update
app.put('/api/toy/:toyId', (req, res) => {
  const { _id, name, price, inStock, reviews, labels } = req.body
  const toy = {
    _id,
    name,
    price,
    inStock,
    reviews,
    labels,
  }
  toyService
    .save(toy)
    .then((savedToy) => res.send(savedToy))
    .catch((err) => res.status(500).send('Cannot update toy'))
})

// read
app.get('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params

  toyService
    .getById(toyId)
    .then((toy) => res.send(toy))
    .catch((err) => res.status(500).send('Cannot get toy'))
})

// delete
app.delete('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params

  toyService
    .remove(toyId)
    .then(() => res.send('Removed'))
    .catch((err) => res.status(500).send('Cannot delete toy'))
})

app.listen(port, () => {
  console.log(`Server is ready at port: http://localhost:${port}/`)
})

// app.get('/products/:id', function (req, res, next) {
//     res.json({msg: 'This is CORS-enabled for all origins!'})
//   })

//   app.listen(80, function () {
//     console.log('CORS-enabled web server listening on port 80')
//   })
