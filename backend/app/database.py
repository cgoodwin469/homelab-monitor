import sqlite3
import psutil
from datetime import datetime
import pytz
import threading
import time

DB_PATH = "/home/chaz/homelab-monitor/backend/metrics.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            cpu_percent REAL,
            ram_percent REAL,
            disk_percent REAL
        )
    """)
    conn.commit()
    conn.close()

def log_metrics():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO metrics (timestamp, cpu_percent, ram_percent, disk_percent)
        VALUES (?, ?, ?, ?)
    """, (
        datetime.now(pytz.timezone("America/New_York")).isoformat(),
        psutil.cpu_percent(interval=1),
        psutil.virtual_memory().percent,
        psutil.disk_usage("/").percent
    ))
    conn.commit()
    conn.close()

def get_history():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT timestamp, cpu_percent, ram_percent, disk_percent
        FROM metrics
        ORDER BY timestamp DESC
        LIMIT 288
    """)
    rows = cursor.fetchall()
    conn.close()
    return [
        {
            "timestamp": r[0],
            "cpu_percent": r[1],
            "ram_percent": r[2],
            "disk_percent": r[3]
        }
        for r in rows
    ]

def start_logging():
    def loop():
        init_db()
        while True:
            log_metrics()
            time.sleep(30)
    thread = threading.Thread(target=loop, daemon=True)
    thread.start()
