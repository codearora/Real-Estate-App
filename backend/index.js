const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('database.db');

app.use(cors());
app.use(express.json());

// Create tables and seed data
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phoneNumber TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        place TEXT NOT NULL,
        area INTEGER NOT NULL,
        bedrooms INTEGER NOT NULL,
        bathrooms INTEGER NOT NULL,
        nearbyHospitals TEXT,
        nearbyColleges TEXT,
        sellerId INTEGER NOT NULL,
        FOREIGN KEY (sellerId) REFERENCES users(id)
    )`);
});

app.post('/api/users/register', (req, res) => {
    const { firstName, lastName, email, phoneNumber, password, role } = req.body;
    db.run(`INSERT INTO users (firstName, lastName, email, phoneNumber, password, role) VALUES (?, ?, ?, ?, ?, ?)`, [firstName, lastName, email, phoneNumber, password, role], function (err) {
        if (err) {
            return res.status(400).send('Error registering user');
        }
        const userId = this.lastID;
        let redirectUrl;
        if (role === 'buyer') {
            redirectUrl = '/buyer';
        } else if (role === 'seller') {
            redirectUrl = '/seller-dashboard';
        }
        res.json({ userId, redirectUrl });
    });
});

app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
        if (err || !row) {
            return res.status(400).send('Invalid credentials');
        }
        res.json({ userId: row.id, role: row.role });
    });
});

app.post('/api/properties', (req, res) => {
    const { place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges } = req.body;
    const sellerId = req.user.id; // Assuming you have authentication middleware to get the seller ID
    db.run(`INSERT INTO properties (place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges, sellerId) VALUES (?, ?, ?, ?, ?, ?, ?)`, [place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges, sellerId], function (err) {
        if (err) {
            return res.status(400).send('Error adding property');
        }
        res.json({ propertyId: this.lastID });
    });
});


app.get('/api/properties', (req, res) => {
    db.all(`SELECT * FROM properties`, (err, rows) => {
        if (err) {
            return res.status(400).send('Error fetching properties');
        }
        res.json(rows);
    });
});

app.get('/api/properties/seller/:sellerId', (req, res) => {
    const { sellerId } = req.params;
    db.all(`SELECT * FROM properties WHERE sellerId = ?`, [sellerId], (err, rows) => {
        if (err) {
            return res.status(400).send('Error fetching properties');
        }
        res.json(rows);
    });
});

app.get('/api/properties/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT properties.*, users.firstName, users.lastName, users.email, users.phoneNumber FROM properties JOIN users ON properties.sellerId = users.id WHERE properties.id = ?`, [id], (err, row) => {
        if (err || !row) {
            return res.status(400).send('Error fetching property');
        }
        res.json(row);
    });
});

app.delete('/api/properties/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM properties WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(400).send('Error deleting property');
        }
        res.sendStatus(204);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
