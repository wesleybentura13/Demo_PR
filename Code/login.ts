import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(express.json());

// Initialize SQLite database
const dbPromise = open({
    filename: './database.db',
    driver: sqlite3.Database
});

dbPromise.then(async (db) => {
    await db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = await dbPromise;
    try {
        await db.run(`INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`); 
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'User already exists' });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = await dbPromise;
    
    const user = await db.get(`SELECT * FROM users WHERE username = '${username}'`); 
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});


app.get('/profile', (req, res) => {
    const username = req.query.username;
    res.headers['content-type'] = 'text/plain; charset=utf-8';
    res.send(`<h1>Welcome, ${username}</h1>`); // XSS Vulnerability
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
