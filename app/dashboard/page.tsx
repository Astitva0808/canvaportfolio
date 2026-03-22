'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setUser(session.user as User)

      // Load username from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single()

      if (profile?.username) setUsername(profile.username)
      setLoading(false)
    }
    getUser()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
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
      <div className="max-w-5xl mx-auto">

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
            {username && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-gray-500 text-xs">Your portfolio:</span>
                <a
                  href={`/site/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-xs hover:underline"
                >
                  localhost:3000/site/{username} ↗
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <Card
            onClick={() => router.push('/profile')}
            className="border-gray-800 bg-gray-950 text-white cursor-pointer hover:border-blue-500 transition-all hover:scale-105"
          >
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">✏️</div>
              <h3 className="font-semibold">Edit Profile</h3>
              <p className="text-gray-400 text-sm mt-1">Add your skills and experience</p>
            </CardContent>
          </Card>

          <Card
            onClick={() => router.push('/projects')}
            className="border-gray-800 bg-gray-950 text-white cursor-pointer hover:border-yellow-500 transition-all hover:scale-105"
          >
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">💼</div>
              <h3 className="font-semibold">My Projects</h3>
              <p className="text-gray-400 text-sm mt-1">Add and manage your projects</p>
            </CardContent>
          </Card>

          <Card
            className="border-gray-800 bg-gray-950 text-white cursor-pointer hover:border-purple-500 transition-all hover:scale-105"
          >
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-semibold">Choose Template</h3>
              <p className="text-gray-400 text-sm mt-1">Pick your portfolio style</p>
              <span className="mt-2 inline-block rounded-full bg-purple-900/40 px-2 py-0.5 text-xs text-purple-300 border border-purple-800">
                Coming soon
              </span>
            </CardContent>
          </Card>

          {/* View Portfolio — now links to real portfolio! */}
          <Card
            onClick={() => username ? window.open(`/site/${username}`, '_blank') : router.push('/profile')}
            className="border-gray-800 bg-gray-950 text-white cursor-pointer hover:border-green-500 transition-all hover:scale-105"
          >
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-semibold">View Portfolio</h3>
              <p className="text-gray-400 text-sm mt-1">
                {username ? 'See your live portfolio' : 'Set username in profile first'}
              </p>
              {username && (
                <span className="mt-2 inline-block rounded-full bg-green-900/40 px-2 py-0.5 text-xs text-green-300 border border-green-800">
                  Live ✓
                </span>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Progress Steps */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Profile</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">Step 1</p>
              <p className="text-xs text-gray-400 mt-1">Fill your info + projects</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Template</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">Step 2</p>
              <p className="text-xs text-gray-400 mt-1">Choose your style</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Launch</p>
              <p className="text-2xl font-bold text-green-400 mt-1">Step 3</p>
              <p className="text-xs text-gray-400 mt-1">Share your portfolio</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
