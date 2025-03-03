import sqlite3
from flask import request, Flask

app = Flask(__name__)

@app.route("/user", methods=["GET"])
def get_user():
    username = request.args.get("username")
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    
  
    query = f"SELECT * FROM users WHERE username = '{username}'"
    cursor.execute(query)
    
    user = cursor.fetchall()
    return {"user": user}

if __name__ == "__main__":
    app.run(debug=True)
