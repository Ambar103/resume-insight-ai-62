import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3, Users, Brain } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { ResumeUpload } from "@/components/ResumeUpload";
import { ATSScore } from "@/components/ATSScore";
import { SkillsMatching } from "@/components/SkillsMatching";
import { AnalysisResults } from "@/components/AnalysisResults";
import heroIllustration from "@/assets/hero-illustration.jpg";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    "React", "TypeScript", "Node.js", "Python", "AWS"
  ]);

  // Mock data for demonstration
  const mockATSScore = {
    score: 78,
    breakdown: {
      keywords: 85,
      format: 92,
      experience: 75,
      skills: 68
    }
  };

  const mockSkills = [
    { name: "React", found: true, relevance: "high" as const },
    { name: "TypeScript", found: true, relevance: "high" as const },
    { name: "JavaScript", found: true, relevance: "high" as const },
    { name: "Node.js", found: true, relevance: "medium" as const },
    { name: "Python", found: false, relevance: "high" as const },
    { name: "AWS", found: true, relevance: "medium" as const },
    { name: "Docker", found: true, relevance: "low" as const },
    { name: "Git", found: true, relevance: "medium" as const }
  ];

  const mockPersonInfo = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Senior Frontend Developer",
    experience: "5+ years",
    education: [
      "B.S. Computer Science, Stanford University (2018)",
      "Full Stack Web Development Bootcamp (2017)"
    ],
    certifications: ["AWS Certified Developer", "React Certified Developer"]
  };

  const mockCompatibility = {
    score: 78,
    verdict: "good" as const,
    reasoning: "The candidate shows strong technical skills in React and TypeScript, which are core requirements for this position. Their 5+ years of experience aligns well with our senior-level expectations. However, they lack Python experience which is preferred for our backend integration tasks. Their AWS certification is a strong plus for our cloud-first architecture. Overall, this candidate would be a good fit with some upskilling in Python."
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    toast({
      title: "Resume uploaded successfully",
      description: `${file.name} is ready for analysis.`
    });
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setAnalysisComplete(false);
    toast({
      title: "File removed",
      description: "Upload a new resume to analyze."
    });
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    toast({
      title: "Analyzing resume...",
      description: "This may take a few moments."
    });

    // Simulate analysis time
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast({
        title: "Analysis complete!",
        description: "Your resume has been successfully analyzed."
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Resume Analyzer</h1>
                  <p className="text-muted-foreground">AI-powered resume analysis and ATS scoring</p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Get instant feedback on your resume with our advanced AI analysis. 
                Check ATS compatibility, skill matching, and overall job fit.
              </p>
            </div>
            <div className="hidden lg:block">
              <img 
                src={heroIllustration} 
                alt="AI-powered resume analysis illustration"
                className="w-full h-auto rounded-2xl shadow-hover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Upload Section */}
          <section className="space-y-4">
            <ResumeUpload
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedFile}
              onRemoveFile={handleRemoveFile}
            />
            
            {uploadedFile && !analysisComplete && (
              <div className="flex justify-center">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-gradient-primary px-8 py-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Resume"
                  )}
                </Button>
              </div>
            )}
          </section>

          {/* Results Section */}
          {analysisComplete && (
            <section>
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="ats" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    ATS Score
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="person" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="p-6 bg-gradient-card shadow-card text-center">
                      <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold text-foreground">ATS Score</h3>
                      <p className="text-2xl font-bold text-primary">{mockATSScore.score}%</p>
                    </Card>
                    <Card className="p-6 bg-gradient-card shadow-card text-center">
                      <Users className="h-8 w-8 text-success mx-auto mb-2" />
                      <h3 className="font-semibold text-foreground">Skills Match</h3>
                      <p className="text-2xl font-bold text-success">
                        {mockSkills.filter(s => s.found).length}/{requiredSkills.length}
                      </p>
                    </Card>
                    <Card className="p-6 bg-gradient-card shadow-card text-center">
                      <Brain className="h-8 w-8 text-info mx-auto mb-2" />
                      <h3 className="font-semibold text-foreground">Compatibility</h3>
                      <p className="text-2xl font-bold text-info">{mockCompatibility.score}%</p>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="ats">
                  <ATSScore score={mockATSScore.score} breakdown={mockATSScore.breakdown} />
                </TabsContent>

                <TabsContent value="skills">
                  <SkillsMatching
                    detectedSkills={mockSkills}
                    requiredSkills={requiredSkills}
                    onRequiredSkillsChange={setRequiredSkills}
                  />
                </TabsContent>

                <TabsContent value="person">
                  <AnalysisResults
                    personInfo={mockPersonInfo}
                    overallCompatibility={mockCompatibility}
                  />
                </TabsContent>
              </Tabs>
            </section>
          )}

          {/* Information Card for Python Backend */}
          <Card className="p-6 bg-info/5 border-info/20">
            <div className="flex items-start space-x-3">
              <Brain className="h-5 w-5 text-info mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">About Python Backend Integration</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  This frontend interface is designed to work with a Python backend for actual resume processing. 
                  The current version shows mock data to demonstrate the UI. To implement real analysis, 
                  you'll need to integrate with Python libraries like spaCy, NLTK, or transformers for NLP processing, 
                  and create APIs that this frontend can call.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
