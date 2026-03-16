'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [status, setStatus] = useState('Testing connection...')

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase.auth.getSession()
      if (error) {
        setStatus('❌ Error: ' + error.message)
      } else {
        setStatus('✅ Supabase connected successfully!')
      }
    }
    testConnection()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold">CanvaPortfolio</h1>
      <p className="mt-4 text-gray-400">Your AI Portfolio Builder</p>
      <p className="mt-6 text-lg">{status}</p>
    </main>
  )
}
