import mysql.connector
from mysql.connector import Error
import time

# 🔁 Retry DB connection
def get_db():
    retries = 10
    delay = 3  # seconds

    for attempt in range(retries):
        try:
            db = mysql.connector.connect(
                host="db",
                user="root",
                password="abc123",
                database="task_manager"
            )
            cursor = db.cursor(dictionary=True)
            print("✅ Connected to MySQL")
            return db, cursor

        except Error as e:
            print(f"⏳ Attempt {attempt+1}/{retries} failed:", e)
            time.sleep(delay)

    print("❌ Could not connect to MySQL after retries")
    return None, None


# 🏗️ Initialize DB + tables
def init_db():
    db, cursor = get_db()

    if db is None:
        print("❌ Skipping DB init (no connection)")
        return

    try:
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Create tasks table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                day VARCHAR(20) NOT NULL,
                task_name VARCHAR(255) NOT NULL,
                task_date DATE NULL,
                task_time TIME NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)

        db.commit()
        print("✅ Tables created / verified")

    except Error as e:
        print("❌ Error creating tables:", e)

    finally:
        cursor.close()
        db.close()
