'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

type Profile = {
  full_name: string
  username: string
  title: string
  bio: string
  location: string
  github_url: string
  linkedin_url: string
  website_url: string
  skills: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    username: '',
    title: '',
    bio: '',
    location: '',
    github_url: '',
    linkedin_url: '',
    website_url: '',
    skills: '',
  })
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [generatingBio, setGeneratingBio] = useState(false)
  const [generatingTagline, setGeneratingTagline] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/login'; return }
      setUserId(session.user.id)
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
          title: data.title || '',
          bio: data.bio || '',
          location: data.location || '',
          github_url: data.github_url || '',
          linkedin_url: data.linkedin_url || '',
          website_url: data.website_url || '',
          skills: data.skills || '',
        })
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  async function handleSave() {
    if (!userId) return
    setSaving(true)
    setError('')
    setSaved(false)

    // Check username is valid — only lowercase letters, numbers, hyphens
    if (profile.username && !/^[a-z0-9-]+$/.test(profile.username)) {
      setError('Username can only contain lowercase letters, numbers and hyphens.')
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() })
    if (error) { setError(error.message) } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  function handleChange(field: keyof Profile, value: string) {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  // Auto-generate username from full name
  function generateUsername() {
    if (profile.full_name) {
      const slug = profile.full_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      handleChange('username', slug)
    }
  }

  async function generateBio() {
    if (!profile.full_name || !profile.title || !profile.skills) {
      setError('Please fill in your name, title and skills before generating a bio.')
      return
    }
    setGeneratingBio(true)
    setError('')
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bio',
          data: { name: profile.full_name, title: profile.title, skills: profile.skills, location: profile.location }
        })
      })
      const data = await res.json()
      if (data.result) { handleChange('bio', data.result) }
      else { setError('AI generation failed. Please try again.') }
    } catch { setError('Failed to connect to AI.') }
    setGeneratingBio(false)
  }

  async function generateTagline() {
    if (!profile.skills || !profile.title) {
      setError('Please fill in your title and skills first.')
      return
    }
    setGeneratingTagline(true)
    setError('')
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'skills',
          data: { skills: profile.skills, title: profile.title }
        })
      })
      const data = await res.json()
      if (data.result) { handleChange('title', data.result) }
      else { setError('AI generation failed. Please try again.') }
    } catch { setError('Failed to connect to AI.') }
    setGeneratingTagline(false)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-gray-400">Loading your profile...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-gray-400 mt-1">Fill in your details to build your portfolio</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800">
              ← Dashboard
            </Button>
          </Link>
        </div>

        {saved && <div className="mb-4 rounded-md bg-green-900/30 p-3 text-sm text-green-400">✅ Profile saved successfully!</div>}
        {error && <div className="mb-4 rounded-md bg-red-900/30 p-3 text-sm text-red-400">❌ {error}</div>}

        {/* Personal Info */}
        <Card className="border-gray-800 bg-gray-950 text-white mb-6">
          <CardHeader><CardTitle className="text-lg">Personal Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="Astitva Srivastava"
                value={profile.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                className="border-gray-700 bg-gray-900 text-white"
              />
            </div>

            {/* Username field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Portfolio Username</Label>
                <button
                  onClick={generateUsername}
                  className="text-xs text-gray-400 hover:text-white border border-gray-700 rounded-full px-3 py-1 bg-gray-900 hover:bg-gray-800 transition-colors"
                >
                  Auto-generate from name
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">localhost:3000/site/</span>
                <Input
                  placeholder="astitva-srivastava"
                  value={profile.username}
                  onChange={(e) => handleChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="border-gray-700 bg-gray-900 text-white flex-1"
                />
              </div>
              {profile.username && (
                <p className="text-xs text-green-400">
                  Your portfolio: localhost:3000/site/{profile.username}
                </p>
              )}
              <p className="text-xs text-gray-500">Only lowercase letters, numbers and hyphens</p>
            </div>

            {/* Title with AI */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Professional Title</Label>
                <button
                  onClick={generateTagline}
                  disabled={generatingTagline}
                  className="text-xs text-purple-400 hover:text-purple-300 border border-purple-800 rounded-full px-3 py-1 bg-purple-900/20 hover:bg-purple-900/40 transition-colors disabled:opacity-50"
                >
                  {generatingTagline ? '✨ Generating...' : '✨ AI Tagline'}
                </button>
              </div>
              <Input
                placeholder="Full Stack Developer | B.Tech CSE"
                value={profile.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="border-gray-700 bg-gray-900 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Lucknow, India"
                value={profile.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="border-gray-700 bg-gray-900 text-white"
              />
            </div>

            {/* Bio with AI */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Bio</Label>
                <button
                  onClick={generateBio}
                  disabled={generatingBio}
                  className="text-xs text-blue-400 hover:text-blue-300 border border-blue-800 rounded-full px-3 py-1 bg-blue-900/20 hover:bg-blue-900/40 transition-colors disabled:opacity-50"
                >
                  {generatingBio ? '✨ Generating...' : '✨ Generate with AI'}
                </button>
              </div>
              <textarea
                placeholder="Write a short bio, or click Generate with AI!"
                value={profile.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500">💡 Fill in name, title and skills first, then Generate with AI</p>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="border-gray-800 bg-gray-950 text-white mb-6">
          <CardHeader><CardTitle className="text-lg">Skills</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Skills (comma separated)</Label>
              <Input
                placeholder="React, Next.js, TypeScript, Node.js, Python"
                value={profile.skills}
                onChange={(e) => handleChange('skills', e.target.value)}
                className="border-gray-700 bg-gray-900 text-white"
              />
              <p className="text-xs text-gray-500">Separate each skill with a comma</p>
            </div>
            {profile.skills && (
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.skills.split(',').map((skill, i) => (
                  skill.trim() && (
                    <span key={i} className="rounded-full bg-blue-900/40 px-3 py-1 text-xs text-blue-300 border border-blue-800">
                      {skill.trim()}
                    </span>
                  )
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Links */}
        <Card className="border-gray-800 bg-gray-950 text-white mb-6">
          <CardHeader><CardTitle className="text-lg">Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input
                placeholder="https://github.com/Astitva0808"
                value={profile.github_url}
                onChange={(e) => handleChange('github_url', e.target.value)}
                className="border-gray-700 bg-gray-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input
                placeholder="https://linkedin.com/in/yourname"
                value={profile.linkedin_url}
                onChange={(e) => handleChange('linkedin_url', e.target.value)}
                className="border-gray-700 bg-gray-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Personal Website (optional)</Label>
              <Input
                placeholder="https://yourwebsite.com"
                value={profile.website_url}
                onChange={(e) => handleChange('website_url', e.target.value)}
                className="border-gray-700 bg-gray-900 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>

      </div>
    </main>
  )
}
