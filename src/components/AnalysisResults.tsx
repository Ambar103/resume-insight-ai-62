import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { User, Briefcase, GraduationCap, MapPin, Calendar, Award } from "lucide-react";

interface PersonInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  experience: string;
  education: string[];
  certifications: string[];
}

interface AnalysisResultsProps {
  personInfo: PersonInfo;
  overallCompatibility: {
    score: number;
    verdict: "excellent" | "good" | "fair" | "poor";
    reasoning: string;
  };
}

export const AnalysisResults = ({ personInfo, overallCompatibility }: AnalysisResultsProps) => {
  const getCompatibilityColor = (verdict: string) => {
    switch (verdict) {
      case "excellent": return "success";
      case "good": return "info";
      case "fair": return "warning";
      case "poor": return "destructive";
      default: return "secondary";
    }
  };

  const getCompatibilityBadgeClass = (verdict: string) => {
    return verdict === "excellent" ? "bg-gradient-success" : "";
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                <p className="text-foreground font-medium">{personInfo.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <p className="text-foreground">{personInfo.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                <p className="text-foreground">{personInfo.phone}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Location
                </Label>
                <p className="text-foreground">{personInfo.location}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  Current Title
                </Label>
                <p className="text-foreground font-medium">{personInfo.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Experience
                </Label>
                <p className="text-foreground">{personInfo.experience}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Education
            </h3>
            <div className="space-y-2">
              {personInfo.education.map((edu, index) => (
                <div key={index} className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-foreground">{edu}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {personInfo.certifications.map((cert, index) => (
                <Badge key={index} variant="secondary">
                  {cert}
                </Badge>
              ))}
              {personInfo.certifications.length === 0 && (
                <p className="text-sm text-muted-foreground">No certifications found</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Overall Compatibility */}
      <Card className="p-6 bg-gradient-card shadow-card border-2 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Overall Job Compatibility</h3>
            <Badge 
              variant={getCompatibilityColor(overallCompatibility.verdict) as any}
              className={getCompatibilityBadgeClass(overallCompatibility.verdict)}
            >
              {overallCompatibility.score}% - {overallCompatibility.verdict.toUpperCase()}
            </Badge>
          </div>
          
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-foreground leading-relaxed">
              {overallCompatibility.reasoning}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};