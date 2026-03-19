'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

type Project = {
  id?: string
  title: string
  description: string
  tech_stack: string
  live_url: string
  github_url: string
}

const emptyProject: Project = {
  title: '',
  description: '',
  tech_stack: '',
  live_url: '',
  github_url: '',
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([{ ...emptyProject }])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function loadProjects() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUserId(session.user.id)
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true })
      if (data && data.length > 0) setProjects(data)
      setLoading(false)
    }
    loadProjects()
  }, [router])

  function handleChange(index: number, field: keyof Project, value: string) {
    setProjects(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  function addProject() {
    setProjects(prev => [...prev, { ...emptyProject }])
  }

  function removeProject(index: number) {
    setProjects(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (!userId) return
    setSaving(true)
    setError('')
    setSaved(false)
    await supabase.from('projects').delete().eq('user_id', userId)
    const projectsToInsert = projects
      .filter(p => p.title.trim() !== '')
      .map(p => ({
        user_id: userId,
        title: p.title,
        description: p.description,
        tech_stack: p.tech_stack,
        live_url: p.live_url,
        github_url: p.github_url,
      }))
    if (projectsToInsert.length > 0) {
      const { error } = await supabase.from('projects').insert(projectsToInsert)
      if (error) { setError(error.message); setSaving(false); return }
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setSaving(false)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-gray-400">Loading your projects...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-gray-400 mt-1">Add projects to showcase in your portfolio</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800">
              ← Dashboard
            </Button>
          </Link>
        </div>

        {saved && <div className="mb-4 rounded-md bg-green-900/30 p-3 text-sm text-green-400">✅ Projects saved successfully!</div>}
        {error && <div className="mb-4 rounded-md bg-red-900/30 p-3 text-sm text-red-400">❌ {error}</div>}

        {projects.map((project, index) => (
          <Card key={index} className="border-gray-800 bg-gray-950 text-white mb-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Project {index + 1} {project.title && `— ${project.title}`}
                </CardTitle>
                {projects.length > 1 && (
                  <Button
                    onClick={() => removeProject(index)}
                    variant="outline"
                    className="border-red-800 bg-transparent text-red-400 hover:bg-red-900/30 text-xs px-3 py-1 h-auto"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project Title</Label>
                <Input
                  placeholder="CanvaPortfolio — AI Portfolio Builder"
                  value={project.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  className="border-gray-700 bg-gray-900 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  placeholder="Describe what this project does..."
                  value={project.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label>Tech Stack (comma separated)</Label>
                <Input
                  placeholder="Next.js, TypeScript, Supabase, Tailwind CSS"
                  value={project.tech_stack}
                  onChange={(e) => handleChange(index, 'tech_stack', e.target.value)}
                  className="border-gray-700 bg-gray-900 text-white"
                />
                {project.tech_stack && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tech_stack.split(',').map((tech, i) => (
                      tech.trim() && (
                        <span key={i} className="rounded-full bg-blue-900/40 px-2 py-0.5 text-xs text-blue-300 border border-blue-800">
                          {tech.trim()}
                        </span>
                      )
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Live URL</Label>
                  <Input
                    placeholder="https://yourproject.com"
                    value={project.live_url}
                    onChange={(e) => handleChange(index, 'live_url', e.target.value)}
                    className="border-gray-700 bg-gray-900 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    placeholder="https://github.com/you/project"
                    value={project.github_url}
                    onChange={(e) => handleChange(index, 'github_url', e.target.value)}
                    className="border-gray-700 bg-gray-900 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={addProject}
          variant="outline"
          className="w-full border-dashed border-gray-700 bg-transparent text-gray-400 hover:bg-gray-900 hover:text-white mb-6"
        >
          + Add Another Project
        </Button>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base"
        >
          {saving ? 'Saving...' : 'Save All Projects'}
        </Button>
      </div>
    </main>
  )
}
