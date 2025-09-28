import { useState, useEffect } from "react";
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
import { uploadAndAnalyzeResume, getJobRequirements, type AnalysisResult } from "@/services/resumeService";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Load job requirements on component mount
  useEffect(() => {
    const loadJobRequirements = async () => {
      try {
        const jobReq = await getJobRequirements();
        setRequiredSkills(jobReq.required_skills || []);
      } catch (error) {
        console.error('Error loading job requirements:', error);
        // Fallback to default skills
        setRequiredSkills(["React", "TypeScript", "Node.js", "Python", "AWS"]);
      }
    };
    
    loadJobRequirements();
  }, []);

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

    try {
      const result = await uploadAndAnalyzeResume(uploadedFile, requiredSkills);
      setAnalysisResult(result);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast({
        title: "Analysis complete!",
        description: "Your resume has been successfully analyzed."
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      setIsAnalyzing(false);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive"
      });
    }
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
                       <p className="text-2xl font-bold text-primary">{analysisResult?.atsScore.score || 0}%</p>
                     </Card>
                     <Card className="p-6 bg-gradient-card shadow-card text-center">
                       <Users className="h-8 w-8 text-success mx-auto mb-2" />
                       <h3 className="font-semibold text-foreground">Skills Match</h3>
                       <p className="text-2xl font-bold text-success">
                         {analysisResult?.skillsAnalysis.filter(s => s.found).length || 0}/{requiredSkills.length}
                       </p>
                     </Card>
                     <Card className="p-6 bg-gradient-card shadow-card text-center">
                       <Brain className="h-8 w-8 text-info mx-auto mb-2" />
                       <h3 className="font-semibold text-foreground">Compatibility</h3>
                       <p className="text-2xl font-bold text-info">{analysisResult?.compatibility.score || 0}%</p>
                    </Card>
                  </div>
                </TabsContent>

                 <TabsContent value="ats">
                   {analysisResult && (
                     <ATSScore 
                       score={analysisResult.atsScore.score} 
                       breakdown={analysisResult.atsScore.breakdown} 
                     />
                   )}
                 </TabsContent>

                 <TabsContent value="skills">
                   {analysisResult && (
                     <SkillsMatching
                       detectedSkills={analysisResult.skillsAnalysis}
                       requiredSkills={requiredSkills}
                       onRequiredSkillsChange={setRequiredSkills}
                     />
                   )}
                 </TabsContent>

                 <TabsContent value="person">
                   {analysisResult && (
                     <AnalysisResults
                       personInfo={analysisResult.personalInfo}
                       overallCompatibility={analysisResult.compatibility}
                     />
                   )}
                 </TabsContent>
              </Tabs>
            </section>
          )}

          {/* Information Card for Python Backend */}
          <Card className="p-6 bg-success/5 border-success/20">
            <div className="flex items-start space-x-3">
              <Brain className="h-5 w-5 text-success mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">✅ Python Backend Integrated</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your resume analyzer now includes real Python-powered backend processing! The system uses 
                  advanced NLP techniques to extract personal information, calculate ATS scores, analyze skills, 
                  and provide compatibility assessments. All analysis is performed server-side using sophisticated 
                  algorithms for accurate resume evaluation.
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
