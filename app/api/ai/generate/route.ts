import { NextRequest, NextResponse } from 'next/server'
import { generateWithFallback } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { type, data } = await req.json()

    let prompt = ''

    if (type === 'bio') {
      prompt = `You are a professional resume writer. Write a compelling 3-sentence professional bio for a tech professional. Be specific, confident, and use active voice. Do not use clichés like "passionate" or "motivated". Return ONLY the bio, no extra text, no quotation marks.

Name: ${data.name}
Professional Title: ${data.title}
Skills: ${data.skills}
Location: ${data.location}`
    }

    if (type === 'project') {
      prompt = `You are a senior software engineer writing portfolio content. Expand these details into a polished 3-sentence project description that highlights technical decisions, impact, and skills demonstrated. Sound confident and technical but readable. Return ONLY the description, no extra text, no quotation marks.

Project Title: ${data.title}
Tech Stack: ${data.tech_stack}
Basic Description: ${data.description}`
    }

    if (type === 'skills') {
      prompt = `Write a single punchy tagline (max 12 words) for a developer portfolio that captures their technical identity. Example: "Full-stack engineer who turns complex problems into clean interfaces". Return ONLY the tagline, no extra text, no quotation marks.

Skills: ${data.skills}
Title: ${data.title}`
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const result = await generateWithFallback(prompt)
    return NextResponse.json({ result })

  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content. Please check your API key and try again.' },
      { status: 500 }
    )
  }
}
