import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface ATSScoreProps {
  score: number;
  breakdown: {
    keywords: number;
    format: number;
    experience: number;
    skills: number;
  };
}

export const ATSScore = ({ score, breakdown }: ATSScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "destructive";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5" />;
    return <TrendingUp className="h-5 w-5" />;
  };

  const scoreColor = getScoreColor(score);

  return (
    <Card className="p-6 bg-gradient-card shadow-card">
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className={`text-${scoreColor}`}>
              {getScoreIcon(score)}
            </div>
            <h3 className="text-lg font-semibold">ATS Compatibility Score</h3>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-foreground">{score}%</div>
            <Badge variant={scoreColor === "success" ? "default" : "secondary"} 
                   className={scoreColor === "success" ? "bg-gradient-success" : ""}>
              {score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Improvement"}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Score Breakdown</h4>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Keywords Match</span>
                <span className="font-medium">{breakdown.keywords}%</span>
              </div>
              <Progress value={breakdown.keywords} className="h-2" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Format & Structure</span>
                <span className="font-medium">{breakdown.format}%</span>
              </div>
              <Progress value={breakdown.format} className="h-2" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Experience Relevance</span>
                <span className="font-medium">{breakdown.experience}%</span>
              </div>
              <Progress value={breakdown.experience} className="h-2" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Skills Alignment</span>
                <span className="font-medium">{breakdown.skills}%</span>
              </div>
              <Progress value={breakdown.skills} className="h-2" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};