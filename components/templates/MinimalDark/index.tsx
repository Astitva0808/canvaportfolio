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

export default function MinimalDark({ profile, projects }: Props) {
  const skills = profile.skills
    ? profile.skills.split(',').map(s => s.trim()).filter(Boolean)
    : []

  return (
    <div style={{ fontFamily: "'Courier New', monospace" }} className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-2">
          <span className="text-green-400 text-sm">{`// hello world`}</span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-3">
          {profile.full_name || 'Your Name'}
        </h1>
        <h2 className="text-xl text-green-400 mb-6">
          {profile.title || 'Developer'}
        </h2>
        {profile.bio && (
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl mb-8">
            {profile.bio}
          </p>
        )}
        {profile.location && (
          <p className="text-gray-500 text-sm mb-8">📍 {profile.location}</p>
        )}

        {/* Social Links */}
        <div className="flex gap-4 flex-wrap">
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
              className="border border-gray-700 text-gray-300 hover:border-green-400 hover:text-green-400 px-4 py-2 text-sm transition-colors">
              GitHub ↗
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
              className="border border-gray-700 text-gray-300 hover:border-green-400 hover:text-green-400 px-4 py-2 text-sm transition-colors">
              LinkedIn ↗
            </a>
          )}
          {profile.website_url && (
            <a href={profile.website_url} target="_blank" rel="noopener noreferrer"
              className="border border-gray-700 text-gray-300 hover:border-green-400 hover:text-green-400 px-4 py-2 text-sm transition-colors">
              Website ↗
            </a>
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="border-t border-gray-800" />
      </div>

      {/* Skills Section */}
      {skills.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h3 className="text-green-400 text-sm mb-6">{`// skills`}</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i}
                className="border border-gray-700 text-gray-300 px-3 py-1 text-sm hover:border-green-400 hover:text-green-400 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      {skills.length > 0 && (
        <div className="max-w-3xl mx-auto px-6">
          <div className="border-t border-gray-800" />
        </div>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-16">
          <h3 className="text-green-400 text-sm mb-8">{`// projects`}</h3>
          <div className="space-y-10">
            {projects.map((project, i) => (
              <div key={project.id || i} className="border border-gray-800 p-6 hover:border-gray-600 transition-colors">

                {/* Thumbnail */}
                {project.thumbnail_url && (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      fill
                      className="object-cover border border-gray-800"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-4 mb-3">
                  <h4 className="text-white font-bold text-lg">{project.title}</h4>
                  <div className="flex gap-3 shrink-0">
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                        className="text-green-400 text-xs hover:underline">
                        Live ↗
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                        className="text-gray-400 text-xs hover:text-white">
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>

                {project.description && (
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                )}

                {/* Tech Stack */}
                {project.tech_stack && (
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.split(',').map((tech, j) => (
                      tech.trim() && (
                        <span key={j} className="text-green-400 text-xs bg-green-900/20 px-2 py-0.5 border border-green-900">
                          {tech.trim()}
                        </span>
                      )
                    ))}
                  </div>
                )}

                {/* Video */}
                {project.video_url && (
                  <div className="mt-4">
                    <video
                      src={project.video_url}
                      controls
                      className="w-full border border-gray-800"
                    />
                  </div>
                )}

              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-6 py-12 border-t border-gray-800">
        <p className="text-gray-600 text-sm text-center">
          Built with <span className="text-green-400">CanvaPortfolio</span>
        </p>
      </footer>

    </div>
  )
}
