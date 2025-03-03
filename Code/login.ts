import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(express.json());

// Mock user database
const users: { [key: string]: string } = {}; // Store username: hashedPassword

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = hashedPassword;
    res.json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = users[username];
    if (!hashedPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Protected route
app.get('/protected', (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ message: 'Protected data', user: decoded });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
