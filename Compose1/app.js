const express = require('express')
const mysql = require('mysql')
const app = express()
const PORT = 3000

app.use(express.json())

const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'db1',
})

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err)
    process.exit(1)
  }

  console.log('Connected to MySQL')

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  connection.query(createUsersTable, (tableErr) => {
    if (tableErr) {
      console.error('Error creating users table:', tableErr)
      process.exit(1)
    }

    app.listen(PORT, () => {
      console.log('App is Running on ' + PORT)
    })
  })
})

app.get('/', (req, res) => {
  return res.json({ message: 'Hey, from Compose' })
})

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users', details: err })
    }
    res.json(results)
  })
})

app.get('/users/:id', (req, res) => {
  const userId = req.params.id
  connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch user', details: err })
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(results[0])
  })
})

app.post('/users', (req, res) => {
  const { name, email } = req.body
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  connection.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create user', details: err })
      }
      res.status(201).json({ id: result.insertId, name, email })
    }
  )
})

app.put('/users/:id', (req, res) => {
  const userId = req.params.id
  const { name, email } = req.body
  if (!name && !email) {
    return res.status(400).json({ error: 'Name or email is required to update' })
  }

  const fields = []
  const values = []
  if (name) {
    fields.push('name = ?')
    values.push(name)
  }
  if (email) {
    fields.push('email = ?')
    values.push(email)
  }
  values.push(userId)

  connection.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values,
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update user', details: err })
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.json({ id: Number(userId), name, email })
    }
  )
})

app.delete('/users/:id', (req, res) => {
  const userId = req.params.id
  connection.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete user', details: err })
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ message: 'User deleted', id: Number(userId) })
  })
})