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

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login'
        return
      }
      setUserId(session.user.id)

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (data) {
        setProfile({
          full_name: data.full_name || '',
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

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...profile,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      setError(error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  function handleChange(field: keyof Profile, value: string) {
    setProfile(prev => ({ ...prev, [field]: value }))
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

        {/* Header */}
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

        {/* Success / Error messages */}
        {saved && (
          <div className="mb-4 rounded-md bg-green-900/30 p-3 text-sm text-green-400">
            ✅ Profile saved successfully!
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-md bg-red-900/30 p-3 text-sm text-red-400">
            ❌ {error}
          </div>
        )}

        {/* Personal Info */}
        <Card className="border-gray-800 bg-gray-950 text-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Personal Info</CardTitle>
          </CardHeader>
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
            <div className="space-y-2">
              <Label>Professional Title</Label>
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
            <div className="space-y-2">
              <Label>Bio</Label>
              <textarea
                placeholder="Write a short bio about yourself..."
                value={profile.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="border-gray-800 bg-gray-950 text-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Skills (comma separated)</Label>
              <Input
                placeholder="React, Next.js, TypeScript, Node.js, Python"
                value={profile.skills}
                onChange={(e) => handleChange('skills', e.target.value)}
                className="border-gray-700 bg-gray-900 text-white"
              />
              <p className="text-xs text-gray-500">
                Separate each skill with a comma — e.g. React, Node.js, Python
              </p>
            </div>
            {/* Skills preview */}
            {profile.skills && (
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.skills.split(',').map((skill, i) => (
                  skill.trim() && (
                    <span
                      key={i}
                      className="rounded-full bg-blue-900/40 px-3 py-1 text-xs text-blue-300 border border-blue-800"
                    >
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
          <CardHeader>
            <CardTitle className="text-lg">Links</CardTitle>
          </CardHeader>
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

        {/* Save Button */}
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
