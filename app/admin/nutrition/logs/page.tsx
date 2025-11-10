"use client"

import { Plus, CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"

const mealLogs = [
  {
    id: 1,
    client: "John Doe",
    date: "2025-01-20",
    mealPhoto: "🍕",
    aiAnalysis: "Pizza - 450 cal",
    detected: "Protein: 18g, Carbs: 55g, Fat: 18g",
    status: "Pending",
    confidence: "85%",
  },
  {
    id: 2,
    client: "Jane Smith",
    date: "2025-01-20",
    mealPhoto: "🥗",
    aiAnalysis: "Salad - 280 cal",
    detected: "Protein: 25g, Carbs: 32g, Fat: 8g",
    status: "Approved",
    confidence: "92%",
  },
  {
    id: 3,
    client: "Mike Johnson",
    date: "2025-01-19",
    mealPhoto: "🍗",
    aiAnalysis: "Chicken - 620 cal",
    detected: "Protein: 52g, Carbs: 48g, Fat: 22g",
    status: "Approved",
    confidence: "88%",
  },
]

export default function ClientMealLogs() {
  const [showUploadModal, setShowUploadModal] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">Client Meal Logs</h1>
          <p className="text-muted-foreground">Uploaded photos analyzed by AI; approval/review</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Upload Meal
        </button>
      </div>

      {/* Meal Logs Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Client</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Photo</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">AI Analysis</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Macros Detected</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Confidence</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-muted-foreground font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mealLogs.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-accent transition-colors">
                  <td className="px-6 py-3 text-foreground font-medium">{log.client}</td>
                  <td className="px-6 py-3 text-muted-foreground">{log.date}</td>
                  <td className="px-6 py-3 text-2xl">{log.mealPhoto}</td>
                  <td className="px-6 py-3 text-foreground">{log.aiAnalysis}</td>
                  <td className="px-6 py-3 text-muted-foreground text-xs">{log.detected}</td>
                  <td className="px-6 py-3 text-foreground font-semibold text-primary">{log.confidence}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                        log.status === "Approved"
                          ? "bg-green-500 bg-opacity-20 text-green-400"
                          : "bg-yellow-500 bg-opacity-20 text-yellow-400"
                      }`}
                    >
                      {log.status === "Approved" ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <button className="text-primary hover:opacity-80 transition-opacity">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-poppins font-bold text-foreground mb-4">Upload Meal Photo</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Select Client</label>
                <select className="w-full bg-background text-foreground px-4 py-2 rounded-lg border border-border focus:outline-none focus:border-primary">
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                  <option>Mike Johnson</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Upload Photo</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                  <p className="text-3xl mb-2">📷</p>
                  <p className="text-sm text-muted-foreground">Click or drag photo here</p>
                  <p className="text-xs text-muted-foreground mt-1">Max 10MB</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button className="flex-1 btn-primary">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
