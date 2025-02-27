const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password", // Change this to your MySQL credentials
    database: "testdb"
});

db.connect(err => {
    if (err) throw err;
    console.log("✅ Connected to MySQL");
});

// 🚨 SQL Injection Vulnerability
app.get("/search", (req, res) => {
    const search = req.query.q;

    // ❌ Vulnerable: Directly injecting user input into SQL query
    const query = { text: "SELECT * FROM users WHERE username = $1", values: [search] };

    console.log("Executing query:", query); // Debugging

    db.query(query, (err, results) => {
        if (err) return res.status(500).send("Database error");
        res.json(results);
    });
});

// 🚨 XSS Vulnerability
app.post("/comment", (req, res) => {
    const { username, comment } = req.body;

    // ❌ Vulnerable: Inserting user input directly into HTML without escaping
    const htmlResponse = `<h1>Thank you, ${username}!</h1><p>Your comment: ${comment}</p>`;
    
    res.headers['content-type'] = 'text/plain; charset=utf-8';
    res.send(plainResponse);
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
