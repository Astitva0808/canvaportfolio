import { supabase } from '@/lib/supabase'
import MinimalDark from '@/components/templates/MinimalDark'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ username: string }>
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params

  // Find profile by name slug
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')

  const profile = profiles?.find(p => {
    const nameSlug = p.full_name?.toLowerCase().replace(/\s+/g, '-')
    return nameSlug === username
  })

  if (!profile) {
    notFound()
  }

  // Load projects for this user
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: true })

  return (
    <MinimalDark
      profile={profile}
      projects={projects || []}
    />
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { username } = await params

  const { data: profiles } = await supabase.from('profiles').select('*')
  const profile = profiles?.find(p => {
    const nameSlug = p.full_name?.toLowerCase().replace(/\s+/g, '-')
    return nameSlug === username
  })

  return {
    title: profile?.full_name
      ? `${profile.full_name} — Portfolio`
      : 'Portfolio',
    description: profile?.bio || 'Check out my portfolio built with CanvaPortfolio',
  }
}
