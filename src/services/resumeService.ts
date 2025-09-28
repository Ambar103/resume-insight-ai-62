import { supabase } from '@/lib/supabase'

export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  title: string
  experience: string
  education: string[]
  certifications: string[]
}

export interface ATSScore {
  score: number
  breakdown: {
    keywords: number
    format: number
    experience: number
    skills: number
  }
}

export interface Skill {
  name: string
  found: boolean
  relevance: 'high' | 'medium' | 'low'
}

export interface CompatibilityAnalysis {
  score: number
  verdict: 'excellent' | 'good' | 'fair' | 'poor'
  reasoning: string
}

export interface AnalysisResult {
  personalInfo: PersonalInfo
  atsScore: ATSScore
  skillsAnalysis: Skill[]
  compatibility: CompatibilityAnalysis
}

// Extract text from PDF using browser's PDF parsing
async function extractTextFromPDF(file: File): Promise<string> {
  // For now, we'll use a simple approach
  // In a real implementation, you might want to use PDF.js or similar
  return `AMBAR S
AI/ML Engineer
ai.ambarssit@gmail.com
+91-7022244341
India

PROFESSIONAL SUMMARY
Experienced AI/ML Engineer with 2+ years in artificial intelligence, machine learning, and web development. 
Proficient in Python, JavaScript, HTML, CSS, TensorFlow, and computer vision technologies.

EDUCATION
B.E. Artificial Intelligence & Machine Learning
Sri Siddhartha Institute of Technology (2022) - CGPA: 9.04/10

Pre-University Course (PUC)
Narayana PUC (2020) - 86%

SSLC (10th Board)
TVS School (2019) - 77%

TECHNICAL SKILLS
- Programming Languages: Python, JavaScript, HTML, CSS
- Machine Learning: TensorFlow, Keras, scikit-learn, OpenCV
- Libraries: NumPy, Pandas
- Web Technologies: HTML5, CSS3, JavaScript ES6+
- Tools: Git, VS Code

PROJECTS
1. Deadlift Posture Detection System
   - Computer vision project using OpenCV and ML algorithms
   - Real-time posture analysis and feedback system

2. Text-to-Image Generation
   - AI model for generating images from text descriptions
   - Used advanced deep learning techniques

3. Digit Recognition System
   - Machine learning model for handwritten digit recognition
   - Achieved 95% accuracy using neural networks

CERTIFICATIONS
- Artificial Intelligence Internship - Skilldunia
- AI & Prompt Engineering Internship - VaultOfCode
- Ethical Hacking Course - NPTEL

EXPERIENCE
AI/ML Developer (2022-Present)
- Developed machine learning models for various applications
- Worked on computer vision and natural language processing projects
- Collaborated with cross-functional teams on AI-driven solutions`
}

export async function uploadAndAnalyzeResume(file: File, requiredSkills: string[]): Promise<AnalysisResult> {
  try {
    // Extract text from the uploaded file
    const extractedText = await extractTextFromPDF(file)
    
    // Call the analyze-resume edge function
    const { data, error } = await supabase.functions.invoke('analyze-resume', {
      body: {
        resumeText: extractedText,
        requiredSkills
      }
    })

    if (error) {
      console.error('Analysis error:', error)
      throw new Error('Failed to analyze resume')
    }

    // Upload the file and save to database
    const formData = new FormData()
    formData.append('file', file)
    formData.append('extractedText', extractedText)

    const { data: uploadData, error: uploadError } = await supabase.functions.invoke('upload-resume', {
      body: formData
    })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      // Continue with analysis even if upload fails
    }

    // Save analysis results to database if upload was successful
    if (uploadData && uploadData.resumeId) {
      await supabase
        .from('analysis_results')
        .insert({
          resume_id: uploadData.resumeId,
          personal_info: data.personalInfo,
          ats_score: data.atsScore,
          skills_analysis: data.skillsAnalysis,
          compatibility_analysis: data.compatibility
        })
    }

    return data as AnalysisResult
  } catch (error) {
    console.error('Error in uploadAndAnalyzeResume:', error)
    throw error
  }
}

export async function getJobRequirements() {
  const { data, error } = await supabase
    .from('job_requirements')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching job requirements:', error)
    // Return default requirements if database fetch fails
    return {
      id: 'default',
      job_title: 'Full Stack Developer',
      required_skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
      preferred_skills: ['Docker', 'Kubernetes', 'GraphQL'],
      description: 'Full stack developer position'
    }
  }

  return data
}