import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  experience: string;
  education: string[];
  certifications: string[];
}

interface ATSScore {
  score: number;
  breakdown: {
    keywords: number;
    format: number;
    experience: number;
    skills: number;
  };
}

interface Skill {
  name: string;
  found: boolean;
  relevance: 'high' | 'medium' | 'low';
}

interface CompatibilityAnalysis {
  score: number;
  verdict: 'excellent' | 'good' | 'fair' | 'poor';
  reasoning: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { resumeText, requiredSkills } = await req.json()

    if (!resumeText) {
      return new Response(JSON.stringify({ error: 'Resume text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Extract personal information using regex patterns
    const personalInfo = extractPersonalInfo(resumeText)
    
    // Calculate ATS score
    const atsScore = calculateATSScore(resumeText, requiredSkills || [])
    
    // Analyze skills
    const skillsAnalysis = analyzeSkills(resumeText, requiredSkills || [])
    
    // Calculate compatibility
    const compatibility = calculateCompatibility(personalInfo, skillsAnalysis, atsScore)

    const analysisResult = {
      personalInfo,
      atsScore,
      skillsAnalysis,
      compatibility
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error analyzing resume:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function extractPersonalInfo(resumeText: string): PersonalInfo {
  const text = resumeText.toLowerCase()
  
  // Extract name (first line that looks like a name)
  const nameMatch = resumeText.match(/^([A-Z][a-z]+ [A-Z][a-z]+|[A-Z\s]+)$/m)
  const name = nameMatch ? nameMatch[1].trim() : "Not found"
  
  // Extract email
  const emailMatch = resumeText.match(/[\w\.-]+@[\w\.-]+\.\w+/)
  const email = emailMatch ? emailMatch[0] : "Not found"
  
  // Extract phone
  const phoneMatch = resumeText.match(/[\+]?[1-9]?[\d\s\-\(\)]{8,15}/)
  const phone = phoneMatch ? phoneMatch[0] : "Not found"
  
  // Extract location (look for city, state patterns)
  const locationMatch = resumeText.match(/([A-Z][a-z]+,?\s+[A-Z]{2}|India|USA|Canada|UK)/i)
  const location = locationMatch ? locationMatch[0] : "Not specified"
  
  // Extract title (look for common job titles)
  const titlePatterns = [
    /(?:software|web|full.stack|front.end|back.end).{0,20}(?:developer|engineer)/i,
    /(?:data|machine learning|ai|ml).{0,20}(?:engineer|scientist|analyst)/i,
    /(?:devops|system).{0,20}engineer/i
  ]
  
  let title = "Not specified"
  for (const pattern of titlePatterns) {
    const match = resumeText.match(pattern)
    if (match) {
      title = match[0]
      break
    }
  }
  
  // Extract experience
  const expMatch = resumeText.match(/(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/i)
  const experience = expMatch ? `${expMatch[1]}+ years` : "Not specified"
  
  // Extract education (look for degree patterns)
  const educationPatterns = [
    /(?:bachelor|master|phd|b\.?[se]|m\.?[se]|ph\.?d).*?(?:computer|software|engineering|technology|science)/i,
    /(?:b\.?e\.?|m\.?e\.?|b\.?tech|m\.?tech).*?(?:\d{4})?/i
  ]
  
  const education: string[] = []
  educationPatterns.forEach(pattern => {
    const matches = resumeText.match(new RegExp(pattern.source, 'gi'))
    if (matches) {
      education.push(...matches)
    }
  })
  
  // Extract certifications
  const certPatterns = [
    /(?:certified|certification).*?(?:aws|azure|google|oracle|microsoft)/i,
    /(?:internship|intern).*?(?:at|with|in)\s+[\w\s]+/i
  ]
  
  const certifications: string[] = []
  certPatterns.forEach(pattern => {
    const matches = resumeText.match(new RegExp(pattern.source, 'gi'))
    if (matches) {
      certifications.push(...matches)
    }
  })

  return {
    name,
    email,
    phone,
    location,
    title,
    experience,
    education: education.length > 0 ? education : ["Not specified"],
    certifications: certifications.length > 0 ? certifications : ["Not specified"]
  }
}

function calculateATSScore(resumeText: string, requiredSkills: string[]): ATSScore {
  const text = resumeText.toLowerCase()
  
  // Keywords score (based on required skills found)
  const foundSkills = requiredSkills.filter(skill => 
    text.includes(skill.toLowerCase())
  ).length
  const keywordsScore = requiredSkills.length > 0 
    ? Math.round((foundSkills / requiredSkills.length) * 100)
    : 80
  
  // Format score (check for common resume sections)
  const formatSections = ['experience', 'education', 'skills', 'projects']
  const foundSections = formatSections.filter(section => 
    text.includes(section)
  ).length
  const formatScore = Math.round((foundSections / formatSections.length) * 100)
  
  // Experience score (check for years of experience and job titles)
  const hasExperience = /\d+\s*(?:years?|yrs?)/.test(text)
  const hasJobTitles = /(developer|engineer|analyst|manager|lead|senior)/i.test(text)
  const experienceScore = (hasExperience ? 50 : 0) + (hasJobTitles ? 50 : 0)
  
  // Skills score (check for technical skills)
  const technicalSkills = [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'html', 'css',
    'typescript', 'angular', 'vue', 'php', 'c++', 'c#', 'ruby', 'go'
  ]
  const foundTechSkills = technicalSkills.filter(skill => 
    text.includes(skill)
  ).length
  const skillsScore = Math.min(Math.round((foundTechSkills / 8) * 100), 100)
  
  // Calculate overall score
  const overallScore = Math.round(
    (keywordsScore * 0.3) + 
    (formatScore * 0.2) + 
    (experienceScore * 0.25) + 
    (skillsScore * 0.25)
  )

  return {
    score: overallScore,
    breakdown: {
      keywords: keywordsScore,
      format: formatScore,
      experience: experienceScore,
      skills: skillsScore
    }
  }
}

function analyzeSkills(resumeText: string, requiredSkills: string[]): Skill[] {
  const text = resumeText.toLowerCase()
  const skills: Skill[] = []
  
  // Define skill categories and relevance
  const skillCategories = {
    high: ['react', 'typescript', 'python', 'javascript', 'node.js', 'aws'],
    medium: ['html', 'css', 'docker', 'kubernetes', 'graphql', 'mongodb'],
    low: ['git', 'agile', 'scrum', 'jira', 'slack', 'figma']
  }
  
  // Check required skills
  requiredSkills.forEach(skill => {
    const found = text.includes(skill.toLowerCase())
    const relevance = skillCategories.high.includes(skill.toLowerCase()) ? 'high' :
                     skillCategories.medium.includes(skill.toLowerCase()) ? 'medium' : 'low'
    
    skills.push({
      name: skill,
      found,
      relevance
    })
  })
  
  // Check for additional skills found in resume
  const additionalSkills = [
    'machine learning', 'tensorflow', 'keras', 'opencv', 'scikit-learn',
    'numpy', 'pandas', 'flask', 'django', 'express', 'mongodb', 'postgresql'
  ]
  
  additionalSkills.forEach(skill => {
    if (text.includes(skill.toLowerCase()) && !skills.find(s => s.name.toLowerCase() === skill)) {
      const relevance = skillCategories.high.includes(skill) ? 'high' :
                       skillCategories.medium.includes(skill) ? 'medium' : 'low'
      
      skills.push({
        name: skill,
        found: true,
        relevance
      })
    }
  })
  
  return skills
}

function calculateCompatibility(
  personalInfo: PersonalInfo, 
  skillsAnalysis: Skill[], 
  atsScore: ATSScore
): CompatibilityAnalysis {
  
  const foundSkills = skillsAnalysis.filter(s => s.found)
  const highRelevanceSkills = foundSkills.filter(s => s.relevance === 'high')
  const overallScore = atsScore.score
  
  let verdict: 'excellent' | 'good' | 'fair' | 'poor'
  let reasoning = ""
  
  if (overallScore >= 85 && highRelevanceSkills.length >= 3) {
    verdict = 'excellent'
    reasoning = `Exceptional candidate with strong technical foundation (${foundSkills.length} relevant skills found). High ATS score of ${overallScore}% indicates excellent resume optimization. Strong match for the position with ${highRelevanceSkills.length} high-priority skills.`
  } else if (overallScore >= 70 && foundSkills.length >= 5) {
    verdict = 'good'
    reasoning = `Strong candidate with good technical skills (${foundSkills.length} skills found). ATS score of ${overallScore}% shows solid resume quality. Good potential for the role with room for growth.`
  } else if (overallScore >= 50 && foundSkills.length >= 3) {
    verdict = 'fair'
    reasoning = `Decent candidate with some relevant experience. ATS score of ${overallScore}% indicates resume could be improved. Has ${foundSkills.length} relevant skills but may need additional training or experience.`
  } else {
    verdict = 'poor'
    reasoning = `Limited match for the position. ATS score of ${overallScore}% suggests significant resume improvements needed. Only ${foundSkills.length} relevant skills found, indicating substantial skill gap.`
  }
  
  const compatibilityScore = Math.min(
    Math.round((overallScore + (foundSkills.length * 5) + (highRelevanceSkills.length * 10)) / 2),
    100
  )
  
  return {
    score: compatibilityScore,
    verdict,
    reasoning
  }
}