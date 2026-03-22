import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const API_URL = "http://100.119.46.124:8001"

function MetricCard({ title, value, unit, percent }) {
  return (
    <div style={{
      background: "#1a1a2e",
      border: "1px solid #16213e",
      borderRadius: "12px",
      padding: "24px",
      minWidth: "200px",
      flex: "1"
    }}>
      <div style={{ color: "#888", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>{title}</div>
      <div style={{ color: "#00ff88", fontSize: "36px", fontWeight: "bold" }}>{value}<span style={{ fontSize: "14px", color: "#888", marginLeft: "4px" }}>{unit}</span></div>
      <div style={{ marginTop: "12px", background: "#0f3460", borderRadius: "4px", height: "6px" }}>
        <div style={{ width: `${percent}%`, background: percent > 80 ? "#ff4444" : "#00ff88", height: "6px", borderRadius: "4px", transition: "width 0.5s ease" }} />
      </div>
      <div style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>{percent}% used</div>
    </div>
  )
}

export default function App() {
  const [metrics, setMetrics] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${API_URL}/metrics`)
      const data = await res.json()
      setMetrics(data)
      setLastUpdated(new Date().toLocaleTimeString())
      setError(null)
    } catch (err) {
      setError("Cannot reach API")
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/metrics/history`)
      const data = await res.json()
      const formatted = data.reverse().map(d => ({
        time: new Date(d.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        cpu: d.cpu_percent,
        ram: d.ram_percent,
        disk: d.disk_percent
      }))
      setHistory(formatted)
    } catch (err) {}
  }

  useEffect(() => {
    fetchMetrics()
    fetchHistory()
    const interval = setInterval(() => {
      fetchMetrics()
      fetchHistory()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "white", fontFamily: "monospace", padding: "40px" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "28px", color: "#00ff88", margin: 0, letterSpacing: "4px" }}>HOMELAB MONITOR</h1>
        <div style={{ color: "#888", fontSize: "12px", marginTop: "8px" }}>
          {error ? <span style={{ color: "#ff4444" }}>⚠ {error}</span> : `Last updated: ${lastUpdated || "loading..."}`}
        </div>
      </div>

      {metrics ? (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
          <MetricCard title="CPU Usage" value={metrics.cpu_percent} unit="%" percent={metrics.cpu_percent} />
          <MetricCard title="RAM Usage" value={(metrics.ram.used / 1024 / 1024 / 1024).toFixed(1)} unit="GB" percent={metrics.ram.percent} />
          <MetricCard title="Disk Usage" value={(metrics.disk.used / 1024 / 1024 / 1024).toFixed(1)} unit="GB" percent={metrics.disk.percent} />
        </div>
      ) : (
        <div style={{ color: "#888", marginBottom: "40px" }}>Connecting to node...</div>
      )}

      {history.length > 0 && (
        <div style={{ background: "#1a1a2e", border: "1px solid #16213e", borderRadius: "12px", padding: "24px" }}>
          <div style={{ color: "#888", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>CPU History</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#16213e" />
              <XAxis dataKey="time" stroke="#888" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis stroke="#888" tick={{ fontSize: 10 }} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ background: "#0a0a1a", border: "1px solid #16213e", borderRadius: "8px" }} />
              <Line type="monotone" dataKey="cpu" stroke="#00ff88" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ marginTop: "40px", color: "#333", fontSize: "11px" }}>
        NODE: 2011 MacBook Pro — Ubuntu Server
      </div>
    </div>
  )
}
