import { createClient } from '@supabase/supabase-js'
import MinimalDark from '@/components/templates/MinimalDark'
import TechBold from '@/components/templates/TechBold'
import CleanLight from '@/components/templates/CleanLight'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Props = {
  params: Promise<{ username: string }>
}

type Profile = {
  id: string
  full_name: string
  username: string
  title: string
  bio: string
  location: string
  github_url: string
  linkedin_url: string
  website_url: string
  skills: string
  template: string
}

type Project = {
  id: string
  title: string
  description: string
  tech_stack: string
  live_url: string
  github_url: string
  thumbnail_url: string
  video_url: string
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params

  // Find profile by username column
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !profile) {
    notFound()
  }

  // Load projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: true })

  const templateData = {
    profile: profile as Profile,
    projects: (projects || []) as Project[],
  }

  // Render the correct template based on user's selection
  const selectedTemplate = profile.template || 'minimal-dark'

  if (selectedTemplate === 'tech-bold') {
    return <TechBold {...templateData} />
  }

  if (selectedTemplate === 'clean-light') {
    return <CleanLight {...templateData} />
  }

  // Default: minimal-dark
  return <MinimalDark {...templateData} />
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params

  const supabaseMeta = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: profile } = await supabaseMeta
    .from('profiles')
    .select('full_name, bio')
    .eq('username', username)
    .single()

  return {
    title: profile?.full_name
      ? `${profile.full_name} — Portfolio`
      : 'Portfolio',
    description: profile?.bio || 'Check out my portfolio built with CanvaPortfolio',
  }
}
