"use client"

import { Dashboard } from "@/components/Dashboard"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6">
        <Dashboard />
      </main>
    </div>
  )
}
