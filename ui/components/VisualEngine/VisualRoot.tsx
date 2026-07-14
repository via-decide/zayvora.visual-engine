"use client"

import { useState } from "react"

type Slide = { slide_id: string; order: number; role: string; title: string; subtitle: string }
type RunResult = {
  status: string
  prompt: string
  intent?: { communication_objective: string; subject: string }
  narrative?: { beats: Array<{ order: number; role: string; message: string }> }
  slide_specification?: { slides: Slide[] }
  artifact?: { slides: Slide[]; slide_count: number; artifact_hash: string; complete: boolean }
  trace?: Array<{ stage: string; hash: string; summary: string }>
  error?: string
}

const starterPrompt = "Why APIs fail at scale"

export default function VisualRoot() {
  const [idea, setIdea] = useState(starterPrompt)
  const [result, setResult] = useState<RunResult | null>(null)
  const [status, setStatus] = useState("Idle")
  const [error, setError] = useState("")

  async function generate() {
    setStatus("Producing intent → narrative → slide specification → visual render")
    setError("")
    setResult(null)
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: idea }),
    })
    const payload = await response.json()
    if (!response.ok || payload.status !== "success" || !payload.artifact?.complete) {
      setStatus("Failed")
      setError(payload.error || "Execution did not produce a complete artifact")
      setResult(payload)
      return
    }
    setResult(payload)
    setStatus("Complete visual artifact ready")
  }

  const slides = result?.artifact?.slides ?? []

  return (
    <main style={{ minHeight: "100vh", background: "#071018", color: "white", fontFamily: "Inter, system-ui, sans-serif", padding: 28 }}>
      <section style={{ display: "grid", gridTemplateColumns: "minmax(320px, 420px) 1fr", gap: 24, height: "calc(100vh - 56px)" }}>
        <aside style={{ border: "1px solid #1d3447", borderRadius: 24, padding: 24, background: "#0b1721" }}>
          <p style={{ color: "#8ddcff", fontWeight: 800, letterSpacing: 1 }}>ZAYVORA VISUAL ENGINE</p>
          <h1 style={{ fontSize: 34, lineHeight: 1.05 }}>Turn one rough idea into a rendered visual artifact.</h1>
          <label style={{ display: "block", marginTop: 24, color: "#bdd7e7", fontWeight: 700 }}>What did I ask the engine to make?</label>
          <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={5} style={{ width: "100%", marginTop: 10, borderRadius: 16, border: "1px solid #31536b", background: "#08121a", color: "white", padding: 14, fontSize: 18 }} />
          <button onClick={generate} style={{ marginTop: 16, width: "100%", border: 0, borderRadius: 16, padding: "15px 18px", color: "#041018", background: "#8ddcff", fontWeight: 900, fontSize: 16 }}>Run visual engine</button>
          <div style={{ marginTop: 24, padding: 16, borderRadius: 16, background: "#0f2230" }}>
            <strong>What is the engine currently producing?</strong>
            <p style={{ color: status === "Failed" ? "#ff9b9b" : "#c7dae6" }}>{status}</p>
            {error ? <p style={{ color: "#ffb4b4" }}>{error}</p> : null}
          </div>
          {result?.intent ? <div style={{ marginTop: 16, color: "#c7dae6" }}><strong>Intent</strong><p>{result.intent.communication_objective}</p></div> : null}
          {result?.trace ? <details style={{ marginTop: 16, color: "#9fb8c8" }}><summary>Execution trace</summary>{result.trace.map((t) => <p key={t.stage}>{t.stage}: {t.summary}</p>)}</details> : null}
        </aside>

        <section style={{ overflow: "auto" }}>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ color: "#8ddcff", fontWeight: 800 }}>Where is my finished visual?</p>
              <h2 style={{ margin: 0, fontSize: 30 }}>{slides.length ? `${slides.length} rendered slides` : "Artifact will appear here"}</h2>
            </div>
            {result?.artifact?.artifact_hash ? <code style={{ color: "#9fb8c8" }}>{result.artifact.artifact_hash.slice(0, 22)}…</code> : null}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))", gap: 18 }}>
            {slides.map((slide) => (
              <article key={slide.slide_id} style={{ minHeight: 250, borderRadius: 24, padding: 26, background: "linear-gradient(145deg, #10283a, #071018 72%)", border: "1px solid #25445c", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
                <p style={{ color: "#8ddcff", fontWeight: 900, letterSpacing: 1 }}>{String(slide.order).padStart(2, "0")} — {slide.role}</p>
                <h3 style={{ fontSize: 34, lineHeight: 1.05 }}>{slide.title}</h3>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
