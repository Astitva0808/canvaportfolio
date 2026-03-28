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

export default function CleanLight({ profile, projects }: Props) {
  const skills = profile.skills
    ? profile.skills.split(',').map(s => s.trim()).filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-gray-900">{profile.full_name || 'Portfolio'}</span>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
            <a href="#skills" className="hover:text-gray-900 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-gray-900 transition-colors">Projects</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="about" className="max-w-4xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-blue-500 text-sm font-medium mb-3 tracking-wide uppercase">
            Hello, I&apos;m
          </p>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {profile.full_name || 'Your Name'}
          </h1>
          <h2 className="text-xl text-gray-500 mb-6 font-normal">
            {profile.title || 'Developer'}
          </h2>
          {profile.bio && (
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              {profile.bio}
            </p>
          )}
          {profile.location && (
            <p className="text-gray-400 text-sm mb-8">📍 {profile.location}</p>
          )}
          <div className="flex gap-3 flex-wrap">
            {profile.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                className="border border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900 px-5 py-2.5 rounded-lg text-sm font-medium transition-all">
                GitHub ↗
              </a>
            )}
            {profile.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all">
                LinkedIn ↗
              </a>
            )}
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noopener noreferrer"
                className="border border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900 px-5 py-2.5 rounded-lg text-sm font-medium transition-all">
                Website ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="border-t border-gray-100" />
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <section id="skills" className="max-w-4xl mx-auto px-6 py-16">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i}
                className="bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 text-gray-700 px-4 py-1.5 rounded-full text-sm transition-all cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Divider */}
      {skills.length > 0 && (
        <div className="max-w-4xl mx-auto px-6">
          <div className="border-t border-gray-100" />
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="projects" className="max-w-4xl mx-auto px-6 py-16">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">Projects</h3>
          <div className="space-y-8">
            {projects.map((project, i) => (
              <div key={project.id || i}
                className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">

                {project.thumbnail_url && (
                  <div className="relative w-full h-56">
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h4 className="text-gray-900 font-semibold text-lg">{project.title}</h4>
                    <div className="flex gap-2 shrink-0">
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                          Live ↗
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                          className="border border-gray-200 text-gray-600 hover:border-gray-400 text-xs px-3 py-1.5 rounded-lg transition-colors">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>
                  )}

                  {project.tech_stack && (
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.split(',').map((tech, j) => (
                        tech.trim() && (
                          <span key={j} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md">
                            {tech.trim()}
                          </span>
                        )
                      ))}
                    </div>
                  )}

                  {project.video_url && (
                    <div className="mt-4">
                      <video src={project.video_url} controls className="w-full rounded-xl" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm">
          Built with <span className="text-blue-500 font-medium">CanvaPortfolio</span>
        </p>
      </footer>

    </div>
  )
}
