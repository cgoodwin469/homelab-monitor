import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const NODES = [
  { name: "midnight-coast-media", label: "2011 MBP — Ubuntu Server", url: "http://100.119.46.124:8001" },
  { name: "midnight-runner", label: "2017 MBP — macOS Ventura", url: "http://100.126.44.69:8002" }
]

function MetricCard({ title, value, unit, percent }) {
  return (
    <div style={{
      background: "#0f3460",
      border: "1px solid #16213e",
      borderRadius: "12px",
      padding: "20px",
      flex: "1",
      minWidth: "150px"
    }}>
      <div style={{ color: "#888", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>{title}</div>
      <div style={{ color: "#00ff88", fontSize: "28px", fontWeight: "bold" }}>{value}<span style={{ fontSize: "12px", color: "#888", marginLeft: "4px" }}>{unit}</span></div>
      <div style={{ marginTop: "10px", background: "#1a1a2e", borderRadius: "4px", height: "5px" }}>
        <div style={{ width: `${percent}%`, background: percent > 80 ? "#ff4444" : "#00ff88", height: "5px", borderRadius: "4px", transition: "width 0.5s ease" }} />
      </div>
      <div style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>{percent}% used</div>
    </div>
  )
}

function NodePanel({ node }) {
  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState(null)

  const fetchMetrics = async () => {
    try {
      const res = await fetch(`${node.url}/metrics`)
      const data = await res.json()
      setMetrics(data)
      setError(null)
    } catch {
      setError("Unreachable")
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      background: "#1a1a2e",
      border: "1px solid #16213e",
      borderRadius: "16px",
      padding: "28px",
      marginBottom: "24px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <div style={{ color: "#00ff88", fontSize: "14px", letterSpacing: "3px", textTransform: "uppercase" }}>{node.name}</div>
          <div style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>{node.label}</div>
        </div>
        <div style={{
          background: error ? "#ff444420" : "#00ff8820",
          border: `1px solid ${error ? "#ff4444" : "#00ff88"}`,
          borderRadius: "20px",
          padding: "4px 12px",
          fontSize: "11px",
          color: error ? "#ff4444" : "#00ff88"
        }}>
          {error ? "⚠ OFFLINE" : "● ONLINE"}
        </div>
      </div>

      {metrics ? (
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <MetricCard title="CPU" value={metrics.cpu_percent} unit="%" percent={metrics.cpu_percent} />
          <MetricCard title="RAM" value={(metrics.ram.used / 1024 / 1024 / 1024).toFixed(1)} unit="GB" percent={metrics.ram.percent} />
          <MetricCard title="Disk" value={(metrics.disk.used / 1024 / 1024 / 1024).toFixed(1)} unit="GB" percent={metrics.disk.percent} />
        </div>
      ) : (
        <div style={{ color: "#888", fontSize: "12px" }}>Connecting...</div>
      )}
    </div>
  )
}

export default function App() {
  const [history, setHistory] = useState([])

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${NODES[0].url}/metrics/history`)
      const data = await res.json()
      const formatted = data.reverse().map(d => ({
        time: new Date(d.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        cpu: d.cpu_percent,
        ram: d.ram_percent,
        disk: d.disk_percent
      }))
      setHistory(formatted)
    } catch {}
  }

  useEffect(() => {
    fetchHistory()
    const interval = setInterval(fetchHistory, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "white", fontFamily: "monospace", padding: "40px" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "28px", color: "#00ff88", margin: 0, letterSpacing: "4px" }}>HOMELAB MONITOR</h1>
        <div style={{ color: "#888", fontSize: "12px", marginTop: "8px" }}>Distributed Infrastructure Dashboard</div>
      </div>

      {NODES.map(node => <NodePanel key={node.name} node={node} />)}

      {history.length > 0 && (
        <div style={{ background: "#1a1a2e", border: "1px solid #16213e", borderRadius: "16px", padding: "28px", marginTop: "8px" }}>
          <div style={{ color: "#888", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>CPU History — midnight-coast-media</div>
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
        HOMELAB — 2 NODES ACTIVE
      </div>
    </div>
  )
}
