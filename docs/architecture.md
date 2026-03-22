# Architecture Overview

## System Design

Homelab Monitor is a distributed infrastructure monitoring system built across a 3-node homelab environment. It collects real-time system metrics from multiple nodes and displays them on a live web dashboard accessible from anywhere via VPN.

---

## Network Topology



M4 MacBook Air (Dev Machine)
|
| Git push
v
GitHub (Source of Truth)
|
| Git pull
v
2011 MacBook Pro ──────────────── 2017 MacBook Pro
(midnight-coast-media)             (midnight-runner)
Ubuntu Server                      macOS Ventura
FastAPI + SQLite                   FastAPI Agent
Port 8001                          Port 8002
\                         /
\                       /
Tailscale VPN Mesh
|
v
React Dashboard
(localhost:5173)
Accessible from anywhere


---

## Node Roles

### M4 MacBook Air — Development
- Writing and editing all code in Cursor
- Git commits and pushes to GitHub
- Running the React + Vite frontend dev server
- SSH access to both homelab nodes

### 2011 MacBook Pro — Backend Server (midnight-coast-media)
- OS: Ubuntu Linux
- Runs the primary FastAPI backend
- Collects and serves live system metrics via psutil
- Logs historical metrics to SQLite every 30 seconds
- Exposes REST API on port 8001

### 2017 MacBook Pro — Frontend Server / Agent (midnight-runner)
- OS: macOS Ventura
- Runs a lightweight FastAPI metrics agent
- Reports CPU, RAM, and disk usage
- Exposes metrics on port 8002

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend | FastAPI (Python) | REST API server |
| Metrics | psutil | System metrics collection |
| Database | SQLite | Historical data logging |
| Frontend | React + Vite | Dashboard UI |
| Charts | Recharts | Data visualization |
| Networking | Tailscale | Secure remote VPN access |
| Version Control | GitHub | Source of truth + deployment |

---

## Deployment Workflow

1. Code is written on M4 MacBook Air in Cursor
2. Changes are committed and pushed to GitHub
3. Each node pulls updates via `git pull origin main`
4. Services are restarted manually or via nohup background process

---

## API Endpoints

### 2011 MBP (Primary Backend)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/metrics` | GET | Live system metrics |
| `/metrics/history` | GET | Last 24 hours of logged metrics |

### 2017 MBP (Agent)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/metrics` | GET | Live system metrics |

---

## Security

- All remote access handled through Tailscale VPN mesh
- No ports exposed directly to the public internet
- CORS configured on all API endpoints
- UFW firewall active on Ubuntu node


