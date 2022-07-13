const fs = require('fs')
const toys = require('../data/toy.json')

module.exports = {
  query,
  getById,
  remove,
  save,
}

function query(filterBy = null) {
  return filterBy ? _filter(filterBy) : Promise.resolve(toys)
}

function _filter(filterBy) {
  const { txt, status, byLabel, bySort } = filterBy
  // txt
  const regex = new RegExp(txt, 'i')
  let filteredToys = toys.filter((toy) => regex.test(toy.name))

  if (status)
    filteredToys = filteredToys.filter((toy) =>
      status === 'In stock' ? toy.inStock : !toy.inStock
    )

  // byLabel
  if (byLabel && byLabel.length) {
    console.log(byLabel)
    filteredToys = filteredToys.filter((toy) =>
      byLabel.some((label) => toy.labels.includes(label))
    )
  }

  // bySort
  if (bySort) {
    const sort = bySort.split(' - ')
    // name
    const dir = sort[1] === 'Increasing' ? 1 : -1
    switch (sort[0]) {
      case 'Name':
        filteredToys = filteredToys.sort(
          (t1, t2) => t1.name.localeCompare(t2.name) * dir
        )
        break
      case 'Price':
        filteredToys = filteredToys.sort(
          (t1, t2) => (t1.price - t2.price) * dir
        )
        break
      case 'Created':
        filteredToys = filteredToys.sort(
          (t1, t2) => (t1.createdAt - t2.createdAt) * dir
        )
        break
    }
  }

  return Promise.resolve(filteredToys)
}

function getById(toyId) {
  const toy = toys.find((toy) => toy._id === toyId)
  return Promise.resolve(toy)
}

function remove(toyId) {
  const idx = toys.findIndex((toy) => toy._id === toyId)
  toys.splice(idx, 1)
  return _saveToysToFile()
}

function save(toy) {
  if (toy._id) {
    const idx = toys.findIndex((t) => t._id === toy._id)
    if (idx === -1) return Promise.reject('No such toy')
    toys[idx] = toy
  } else {
    toy._id = _makeId()
    toys.push(toy)
  }

  return _saveToysToFile().then(() => toy)
}

function _makeId(length = 5) {
  var txt = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return txt
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const content = JSON.stringify(toys, null, 2)
    fs.writeFile('./data/toy.json', content, (err) => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      resolve()
    })
  })
}
