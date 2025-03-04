app.post("/register", (req, res) => {
    const { username, password, role } = req.body; // Role is meant to be "user" or "admin"
  
    const query = "INSERT INTO users (username, password, role) VALUES (?,?,?)";
  
    db.query(query, [username, password, role], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
  
      res.json({ message: "User registered successfully" });
    });
  });
  