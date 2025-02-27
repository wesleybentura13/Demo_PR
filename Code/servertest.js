const express = require("express");
const mysql = require("mysql");

const app = express();
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password", // Change this to match your DB credentials
    database: "testdb"
});

db.connect(err => {
    if (err) throw err;
    console.log("✅ Connected to MySQL");
});

// 🚨 CRITICAL SQL INJECTION: Allows data exfiltration and UNION-based attacks
app.get("/user", (req, res) => {
    const userId = req.query.id;

    // ❌ Vulnerable: Directly concatenating user input into SQL query
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    console.log("Executing query:", query); // Debugging

    db.query(query, (err, results) => {
        if (err) return res.status(500).send("Database error");
        res.json(results);
    });
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
