'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    // Scroll reveal animation
    const reveals = document.querySelectorAll('.reveal')

    function revealOnScroll() {
      const windowHeight = window.innerHeight
      reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top
        if (elementTop < windowHeight - 100) {
          el.classList.add('active')
        }
      })
    }

    window.addEventListener('scroll', revealOnScroll)
    revealOnScroll()

    return () => window.removeEventListener('scroll', revealOnScroll)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');

        .landing * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        .landing { background: radial-gradient(circle at top, #0b0f1a, #020617); color: #e5e7eb; min-height: 100vh; }

        /* NAVBAR */
        .landing .nav { display: flex; justify-content: space-between; align-items: center; padding: 24px 100px; }
        .landing .nav nav { display: flex; gap: 30px; }
        .landing .nav a { color: #9ca3af; text-decoration: none; font-size: 14px; transition: 0.3s; }
        .landing .nav a:hover { color: white; }

        /* BUTTON */
        .landing .btn { background: #111827; color: white; padding: 10px 18px; border-radius: 8px; border: 1px solid #1f2937; cursor: pointer; transition: 0.3s ease; font-size: 14px; }
        .landing .btn:hover { transform: translateY(-2px); }
        .landing .primary { background: linear-gradient(90deg, #6366f1, #22c55e); border: none; padding: 12px 24px; font-size: 16px; }

        /* HERO */
        .landing .hero { display: flex; justify-content: space-between; align-items: center; padding: 80px 100px; min-height: 100vh; }
        .landing .hero-text { max-width: 600px; display: flex; flex-direction: column; justify-content: center; }
        .landing .hero-text h1 { font-size: 64px; line-height: 1.1; margin-bottom: 20px; font-weight: 600; }
        .landing .hero-text span { background: linear-gradient(90deg, #6366f1, #22c55e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .landing .hero-text p { margin-bottom: 30px; color: #9ca3af; font-size: 18px; line-height: 1.6; }
        .landing .hero-text .btn { align-self: flex-start; }

        /* HERO CARD */
        .landing .hero-card { width: 320px; height: 200px; background: rgba(255,255,255,0.04); border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 60px rgba(99,102,241,0.15); transition: transform 0.3s ease; }
        .landing .card-inner { text-align: center; }
        .landing .card-inner h3 { font-size: 20px; margin-bottom: 8px; }
        .landing .card-inner p { color: #9ca3af; font-size: 14px; }

        /* SECTIONS */
        .landing .section { padding: 100px 80px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
        .landing .section h2 { font-size: 32px; margin-bottom: 20px; }
        .landing .section p { color: #9ca3af; }

        /* FEATURE CARDS */
        .landing .cards { display: flex; justify-content: center; gap: 30px; padding: 80px; }
        .landing .feature-card { background: #111827; padding: 30px; border-radius: 16px; width: 250px; border: 1px solid #1f2937; transition: 0.3s; }
        .landing .feature-card:hover { transform: translateY(-8px); border-color: #6366f1; }
        .landing .feature-card h3 { font-size: 18px; margin-bottom: 10px; }
        .landing .feature-card p { color: #9ca3af; font-size: 14px; }

        /* SCROLL ANIMATION */
        .landing .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s ease; }
        .landing .reveal.active { opacity: 1; transform: translateY(0); }
        .landing .delay-1 { transition-delay: 0.1s; }
        .landing .delay-2 { transition-delay: 0.3s; }
        .landing .delay-3 { transition-delay: 0.5s; }
        .landing .delay-4 { transition-delay: 0.7s; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .landing .nav { padding: 20px 24px; }
          .landing .hero { flex-direction: column; text-align: center; gap: 40px; padding: 60px 24px; }
          .landing .hero-text { align-items: center; }
          .landing .hero-text h1 { font-size: 40px; }
          .landing .hero-text .btn { align-self: center; }
          .landing .cards { flex-direction: column; align-items: center; padding: 40px 24px; }
          .landing .section { padding: 60px 24px; }
        }
      `}</style>

      <div className="landing">

        {/* NAVBAR */}
        <header className="nav">
          <div className="logo" style={{ fontWeight: 600, fontSize: '18px' }}>CanvaPortfolio</div>
          <nav>
            <a href="#features">Features</a>
            <a href="#templates">Templates</a>
            <a href="#pricing">Pricing</a>
          </nav>
          <button className="btn" onClick={() => router.push('/login')}>
            Sign In
          </button>
        </header>

        {/* HERO */}
        <section className="hero reveal">
          <div className="hero-text">
            <h1 className="reveal delay-1">
              Build your portfolio<br />
              with <span>intelligence</span>
            </h1>
            <p className="reveal delay-2">
              Turn your CV into a modern, interactive portfolio in seconds.
              AI writes your bio, expands your projects, and helps you stand out.
            </p>
            <button
              className="btn primary reveal delay-3"
              onClick={() => router.push('/signup')}
            >
              Start for Free →
            </button>
          </div>

          <div className="hero-card reveal delay-4">
            <div className="card-inner">
              <h3>✨ AI Powered</h3>
              <p>Real-time portfolio generation</p>
            </div>
          </div>
        </section>

        {/* FEATURES HEADING */}
        <section className="section reveal" id="features">
          <h2 className="reveal delay-1">Designed for modern creators</h2>
          <p className="reveal delay-2">Minimal, fast and beautiful UI experience — built for tech professionals.</p>
        </section>

        {/* FEATURE CARDS */}
        <section className="cards reveal" id="templates">
          <div className="feature-card reveal delay-1">
            <h3>💼 Projects</h3>
            <p>Showcase your work beautifully with AI-expanded descriptions.</p>
          </div>
          <div className="feature-card reveal delay-2">
            <h3>⚡ Skills</h3>
            <p>Visualize your strengths clearly with smart skill tags.</p>
          </div>
          <div className="feature-card reveal delay-3">
            <h3>🎨 Templates</h3>
            <p>Choose from stunning templates — Minimal Dark, Tech Bold, Clean Light.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="section reveal" id="pricing">
          <h2 className="reveal delay-1">Start building today</h2>
          <p className="reveal delay-2" style={{ marginBottom: '30px' }}>
            Free to get started. No credit card required.
          </p>
          <button
            className="btn primary reveal delay-3"
            onClick={() => router.push('/signup')}
          >
            Get Started for Free →
          </button>
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#4b5563', fontSize: '14px' }}>
          Built with ❤️ by Astitva Srivastava · CanvaPortfolio 2026
        </footer>

      </div>
    </>
  )
}
