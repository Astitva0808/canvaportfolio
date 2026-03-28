'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const TEMPLATES = [
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    description: 'Clean monospace aesthetic with green accents. Perfect for developers.',
    colors: ['#0a0a0a', '#22c55e', '#4ade80'],
    emoji: '🖤',
    free: true,
  },
  {
    id: 'tech-bold',
    name: 'Tech Bold',
    description: 'Vibrant gradient hero with card-based project grid. Modern and eye-catching.',
    colors: ['#0f0f1a', '#8b5cf6', '#06b6d4'],
    emoji: '⚡',
    free: true,
  },
  {
    id: 'clean-light',
    name: 'Clean Light',
    description: 'Minimal white design with clean typography. Professional and readable.',
    colors: ['#ffffff', '#3b82f6', '#6b7280'],
    emoji: '✨',
    free: true,
  },
]

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('minimal-dark')
  const [username, setUsername] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, template')
        .eq('id', session.user.id)
        .single()

      if (profile?.username) setUsername(profile.username)
      if (profile?.template) setSelectedTemplate(profile.template)
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSave() {
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    await supabase
      .from('profiles')
      .update({ template: selectedTemplate })
      .eq('id', session.user.id)

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setSaving(false)
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-gray-400">Loading templates...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Choose Template</h1>
            <p className="text-gray-400 mt-1">Pick the style for your portfolio</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800">
              ← Dashboard
            </Button>
          </Link>
        </div>

        {saved && (
          <div className="mb-6 rounded-md bg-green-900/30 p-3 text-sm text-green-400">
            ✅ Template saved! Visit your portfolio to see it.
          </div>
        )}

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all hover:scale-105 ${
                selectedTemplate === template.id
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              {/* Template Preview */}
              <div
                className="h-40 flex items-center justify-center relative"
                style={{ backgroundColor: template.colors[0] }}
              >
                <span className="text-5xl">{template.emoji}</span>
                {selectedTemplate === template.id && (
                  <div className="absolute top-3 right-3 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                )}
                {/* Color dots */}
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {template.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Template Info */}
              <div className="bg-gray-950 p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white">{template.name}</h3>
                  {template.free && (
                    <span className="text-xs bg-green-900/40 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">
                      Free
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{template.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Preview + Save */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {saving ? 'Saving...' : `Save — ${TEMPLATES.find(t => t.id === selectedTemplate)?.name}`}
          </Button>

          {username && (
            <a
              href={`/site/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                variant="outline"
                className="w-full border-gray-700 bg-gray-900 text-white hover:bg-gray-800 py-3"
              >
                Preview Portfolio ↗
              </Button>
            </a>
          )}
        </div>

        {!username && (
          <p className="text-gray-500 text-sm mt-4 text-center">
            💡 Set your username in{' '}
            <Link href="/profile" className="text-blue-400 hover:underline">Profile</Link>{' '}
            to preview your portfolio
          </p>
        )}

      </div>
    </main>
  )
}
