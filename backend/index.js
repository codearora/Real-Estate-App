const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const db = new sqlite3.Database('database.db');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from the 'uploads' directory

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

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
        image TEXT,
        FOREIGN KEY (sellerId) REFERENCES users(id)
    )`);
});

// Register a user
app.post('/api/users/register', (req, res) => {
    const { firstName, lastName, email, phoneNumber, password, role } = req.body;
    db.run(`INSERT INTO users (firstName, lastName, email, phoneNumber, password, role) VALUES (?, ?, ?, ?, ?, ?)`,
        [firstName, lastName, email, phoneNumber, password, role], function (err) {
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

// Login a user
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
        if (err || !row) {
            return res.status(400).send('Invalid credentials');
        }
        res.json({ userId: row.id, role: row.role });
    });
});

// Add a property with image upload
app.post('/api/properties', upload.single('image'), (req, res) => {
    const { place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges, sellerId } = req.body;
    const image = req.file ? req.file.path : null;
    db.run(`INSERT INTO properties (place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges, sellerId, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges, sellerId, image], function (err) {
            if (err) {
                return res.status(400).send('Error adding property');
            }
            res.json({ propertyId: this.lastID });
        });
});

// Fetch properties for a seller
app.get('/api/properties/seller/:sellerId', (req, res) => {
    const { sellerId } = req.params;
    db.all(`SELECT * FROM properties WHERE sellerId = ?`, [sellerId], (err, rows) => {
        if (err) {
            return res.status(400).send('Error fetching properties');
        }
        res.json(rows);
    });
});

// Fetch all properties
app.get('/api/properties', (req, res) => {
    db.all(`SELECT * FROM properties`, (err, rows) => {
        if (err) {
            return res.status(400).send('Error fetching properties');
        }
        res.json(rows);
    });
});

// Fetch a single property
app.get('/api/properties/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT properties.*, users.firstName, users.lastName, users.email, users.phoneNumber 
            FROM properties JOIN users ON properties.sellerId = users.id WHERE properties.id = ?`,
        [id], (err, row) => {
            if (err || !row) {
                return res.status(400).send('Error fetching property');
            }
            res.json(row);
        });
});

// Update a property
app.put('/api/properties/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges } = req.body;
    const image = req.file ? req.file.path : req.body.image; // Keep existing image if no new image is uploaded
    db.run(`UPDATE properties SET place = ?, area = ?, bedrooms = ?, bathrooms = ?, nearbyHospitals = ?, nearbyColleges = ?, image = ? WHERE id = ?`,
        [place, area, bedrooms, bathrooms, nearbyHospitals, nearbyColleges, image, id], function (err) {
            if (err) {
                return res.status(400).send('Error updating property');
            }
            res.sendStatus(200);
        });
});

// Delete a property
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
