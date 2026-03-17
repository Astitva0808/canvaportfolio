'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type User = {
  email: string
  created_at: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login'
        return
      }
      setUser(session.user as User)
      setLoading(false)
    }
    getUser()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-gray-400">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">CanvaPortfolio</h1>
            <p className="text-gray-400 mt-1">Build your AI portfolio</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800"
          >
            Logout
          </Button>
        </div>

        {/* Welcome Card */}
        <Card className="border-gray-800 bg-gray-950 text-white mb-6">
          <CardHeader>
            <CardTitle className="text-xl">
              Welcome back, {user?.user_metadata?.full_name || user?.email} 👋
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-sm">Email: {user?.email}</p>
            <p className="text-gray-400 text-sm mt-1">
              Account created: {new Date(user?.created_at ?? '').toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gray-800 bg-gray-950 text-white cursor-pointer hover:border-blue-500 transition-colors">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">✏️</div>
              <h3 className="font-semibold">Edit Profile</h3>
              <p className="text-gray-400 text-sm mt-1">
                Add your projects, skills and experience
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-950 text-white cursor-pointer hover:border-blue-500 transition-colors">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-semibold">Choose Template</h3>
              <p className="text-gray-400 text-sm mt-1">
                Pick and customize your portfolio style
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-950 text-white cursor-pointer hover:border-blue-500 transition-colors">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-semibold">View Portfolio</h3>
              <p className="text-gray-400 text-sm mt-1">
                See your live portfolio page
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </main>
  )
}
