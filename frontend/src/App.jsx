import { useState, useEffect } from "react"

const API_URL = "http://100.119.46.124:8001"

function MetricCard({ title, value, unit, percent }) {
  return (
    <div style={{
      background: "#1a1a2e",
      border: "1px solid #16213e",
      borderRadius: "12px",
      padding: "24px",
      minWidth: "200px"
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

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
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
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <MetricCard title="CPU Usage" value={metrics.cpu_percent} unit="%" percent={metrics.cpu_percent} />
          <MetricCard title="RAM Usage" value={(metrics.ram.used / 1024 / 1024 / 1024).toFixed(1)} unit="GB" percent={metrics.ram.percent} />
          <MetricCard title="Disk Usage" value={(metrics.disk.used / 1024 / 1024 / 1024).toFixed(1)} unit="GB" percent={metrics.disk.percent} />
        </div>
      ) : (
        <div style={{ color: "#888" }}>Connecting to node...</div>
      )}

      <div style={{ marginTop: "40px", color: "#333", fontSize: "11px" }}>
        NODE: 2011 MacBook Pro — Ubuntu Server
      </div>
    </div>
  )
}
