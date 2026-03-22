# Homelab Monitor

A self-hosted infrastructure monitoring dashboard built on a distributed homelab environment.

Tracks real-time system metrics (CPU, RAM, disk, network) across multiple nodes and displays them in a clean web dashboard.

---

## Architecture

| Node | Hardware | OS | Role |
|------|----------|----|------|
| Server | 2011 MacBook Pro | Ubuntu | Backend API + Database |
| Frontend | 2017 MacBook Pro | macOS Ventura | Frontend Server |
| Dev | M4 MacBook Air | macOS | Development + Git |

---

## Tech Stack

- **Backend:** FastAPI (Python)
- **Database:** SQLite
- **Frontend:** React + Vite
- **Metrics Agent:** Glances / psutil
- **Version Control:** GitHub

---

## Features (In Progress)

- [ ] System metrics collection (CPU, RAM, disk, network)
- [ ] REST API to expose metrics per node
- [ ] Historical data logging to SQLite
- [ ] React dashboard with live updates
- [ ] Multi-node support (both homelab machines)

---

## Project Status

🟡 In active development

---

## Author

Built as a portfolio project while pursuing AWS Cloud Associate certification.
