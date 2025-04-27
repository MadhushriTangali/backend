const express = require('express')
const path = require('path')

const sqlite3 = require('sqlite3')
const {open} = require('sqlite')

const app = express()
app.use(express.json())
const cors = require('cors')

app.use(cors())

let db

const dbPath = path.join(__dirname, 'account.db')

const initializeDb = async () => {
  try {
    db = await open({filename: dbPath, driver: sqlite3.Database})
    app.listen(4000, () => {
      console.log('server started at port 4000')
    })
  } catch (e) {
    console.error(e)
  }
}
initializeDb()

app.get('/api/transactions', async (req, res) => {
  const getQuery = `SELECT * FROM transactions ORDER BY date DESC`
  const array = await db.all(getQuery)
  res.send(array)
})

app.post('/api/transactions', async (req, res) => {
  const {amount, date, description} = req.body
  const postQuery = `INSERT INTO transactions (amount, date, description) VALUES ('${amount}', '${date}', '${description}')`
  if (!amount || !date || !description)
    return res.status(400).json({error: 'Missing fields'})

  await db.run(postQuery)
  res.send('Transaction added successfully')
})

app.put('/api/transactions/:id', async (req, res) => {
  const {amount, date, description} = req.body
  const id = req.params.id
  const putQuery = `UPDATE transactions SET amount = '${amount}', date = '${date}', description = '${description}' WHERE id = ${id}`
  await db.run(putQuery)
  res.send('Transaction updated successfully')
})

app.delete('/api/transactions/:id', async (req, res) => {
  const id = req.params.id
  const deleteQuery = `DELETE FROM transactions WHERE id = ${id}`
  await db.run(deleteQuery)
  res.send('Transaction deleted successfully')
})
