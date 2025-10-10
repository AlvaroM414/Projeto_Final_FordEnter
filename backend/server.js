const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-super-secret-key';
const USERS_DB_PATH = path.join(__dirname, 'users.json');
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());

let users = [];
let userIdCounter = 1;

// --- Database Functions ---

const loadUsers = () => {
    try {
        if (fs.existsSync(USERS_DB_PATH)) {
            const data = fs.readFileSync(USERS_DB_PATH, 'utf8');
            users = JSON.parse(data);
            // Set the counter to the next available ID
            if (users.length > 0) {
                userIdCounter = Math.max(...users.map(u => u.id)) + 1;
            }
            console.log('Users loaded from users.json');
        } else {
            console.log('users.json not found, starting with an empty user list.');
        }
    } catch (error) {
        console.error('Error loading users from users.json:', error);
    }
};

const saveUsers = () => {
    try {
        fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2));
        console.log('Users saved to users.json');
    } catch (error) {
        console.error('Error saving users to users.json:', error);
    }
};

// --- Middleware ---

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// --- API Endpoints ---

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'E-mail and password are required.' });
        }

        const userExists = users.find(u => u.email === email);
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            id: userIdCounter++,
            email,
            password: hashedPassword,
            transacoes: [],
            orcamentos: [],
            metas: [],
        };

        users.push(newUser);
        saveUsers(); // Save users to file

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'E-mail and password are required.' });
        }

        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- Transacoes Endpoints ---

app.get('/api/transacoes', authenticateJWT, (req, res) => {
    const user = users.find(u => u.id === req.user.userId);
    if (user) {
        res.json(user.transacoes || []);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.post('/api/transacoes', authenticateJWT, (req, res) => {
    const user = users.find(u => u.id === req.user.userId);
    if (user) {
        const newTransaction = { ...req.body, id: Date.now() };
        if (!user.transacoes) {
            user.transacoes = [];
        }
        user.transacoes.push(newTransaction);
        saveUsers();
        res.status(201).json(newTransaction);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.delete('/api/transacoes/:id', authenticateJWT, (req, res) => {
    const user = users.find(u => u.id === req.user.userId);
    if (user) {
        const transactionId = parseInt(req.params.id, 10);
        const initialLength = user.transacoes.length;
        user.transacoes = user.transacoes.filter(t => t.id !== transactionId);
        if (user.transacoes.length < initialLength) {
            saveUsers();
            res.sendStatus(204);
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


app.listen(PORT, () => {
    loadUsers(); // Load users on server start
    console.log(`Backend server is running on http://localhost:${PORT}`);
});