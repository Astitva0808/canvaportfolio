import Image from 'next/image'

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

type Props = {
  profile: Profile
  projects: Project[]
}

export default function TechBold({ profile, projects }: Props) {
  const skills = profile.skills
    ? profile.skills.split(',').map(s => s.trim()).filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">

      {/* Hero — gradient background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-blue-600/20 to-cyan-500/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 py-28">
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1 text-sm text-cyan-300 mb-6">
            Available for opportunities
          </div>
          <h1 className="text-6xl font-black text-white mb-4 leading-tight">
            {profile.full_name || 'Your Name'}
          </h1>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            {profile.title || 'Developer'}
          </h2>
          {profile.bio && (
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mb-8">
              {profile.bio}
            </p>
          )}
          {profile.location && (
            <p className="text-gray-400 text-sm mb-8">📍 {profile.location}</p>
          )}
          <div className="flex gap-4 flex-wrap">
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105">
                GitHub ↗
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105 hover:opacity-90">
                LinkedIn ↗
              </a>
            )}
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105">
                Website ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-6">Tech Stack</h3>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, i) => (
              <span key={i}
                className="bg-white/5 border border-white/10 hover:border-violet-400/50 hover:bg-violet-500/10 text-gray-300 hover:text-violet-300 px-4 py-2 rounded-lg text-sm transition-all">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects Grid */}
      {projects.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h3 className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-8">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <div key={project.id || i}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-400/50 transition-all hover:bg-white/8 group">

                {/* Thumbnail */}
                {project.thumbnail_url ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] to-transparent" />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="text-4xl">💻</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="text-white font-bold text-lg leading-tight">{project.title}</h4>
                    <div className="flex gap-2 shrink-0">
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                          className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-xs px-3 py-1 rounded-full hover:opacity-90">
                          Live ↗
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                          className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full hover:bg-white/20">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {project.tech_stack && (
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.split(',').map((tech, j) => (
                        tech.trim() && (
                          <span key={j} className="bg-violet-500/20 text-violet-300 text-xs px-2 py-0.5 rounded-md border border-violet-500/30">
                            {tech.trim()}
                          </span>
                        )
                      ))}
                    </div>
                  )}

                  {project.video_url && (
                    <div className="mt-4">
                      <video src={project.video_url} controls className="w-full rounded-lg" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-white/10 text-center">
        <p className="text-gray-600 text-sm">
          Built with <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent font-medium">CanvaPortfolio</span>
        </p>
      </footer>

    </div>
  )
}
