// index.js

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    connectionString: "postgres://default:XmW1GFKgA6jr@ep-royal-surf-42372665-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require?sslmode=require",
});

pool.connect((err) => {
  if (err) throw err
  console.log("Connect to PostgreSQL successfully!")
})

// console.log(pool.query('SELECT * FROM USERS'));
app.use(bodyParser.json());

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// API endpoints

// Get all posts made by a user
app.get('/users/:userId/posts', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Fetch posts from the database based on userId
    const queryResult = await pool.query('SELECT * FROM posts WHERE user_id = $1', [userId]);
    res.json(queryResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all existing posts
app.get('/:userId/posts', async (req, res) => {
  try {
    // Fetch all posts from the database
    const userId = req.params.userId;
    const queryResult = await pool.query('SELECT * FROM posts WHERE USER_ID=$1',[userId]);
    res.json(queryResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all followers of a user
app.get('/users/:userId/followers', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Fetch followers from the database based on userId
    const queryResult = await pool.query('SELECT * FROM followers WHERE user_id = $1', [userId]);
    res.json(queryResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get user's basic details
app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Fetch user details from the database based on userId
    const queryResult = await pool.query('SELECT iD,NAME,EMAIL FROM users WHERE id = $1', [userId]);
    res.json(queryResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update user's details
app.put('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email } = req.body;
    // Update user details in the database based on userId
    await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, userId]);
    res.json({ message: 'User details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a post
app.post('/posts', async (req, res) => {
  try {
    const { userId, content } = req.body;
    // Insert new post into the database
    await pool.query('INSERT INTO posts (user_id, content) VALUES ($1, $2)', [userId, content]);
    res.json({ message: 'Post created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/',(req,res)=>{
  res.send('Working');
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
});
