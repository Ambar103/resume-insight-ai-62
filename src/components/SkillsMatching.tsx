import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";
import { useState } from "react";

interface Skill {
  name: string;
  found: boolean;
  relevance: "high" | "medium" | "low";
}

interface SkillsMatchingProps {
  detectedSkills: Skill[];
  requiredSkills: string[];
  onRequiredSkillsChange: (skills: string[]) => void;
}

export const SkillsMatching = ({ 
  detectedSkills, 
  requiredSkills, 
  onRequiredSkillsChange 
}: SkillsMatchingProps) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
      onRequiredSkillsChange([...requiredSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onRequiredSkillsChange(requiredSkills.filter(skill => skill !== skillToRemove));
  };

  const getSkillVariant = (skill: Skill) => {
    if (!skill.found) return "secondary";
    return skill.relevance === "high" ? "default" : "secondary";
  };

  const getSkillBadgeClass = (skill: Skill) => {
    if (!skill.found) return "";
    if (skill.relevance === "high") return "bg-gradient-success";
    return "";
  };

  const foundSkills = detectedSkills.filter(skill => skill.found);
  const missingSkills = requiredSkills.filter(
    reqSkill => !detectedSkills.find(skill => 
      skill.name.toLowerCase() === reqSkill.toLowerCase() && skill.found
    )
  );

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Required Skills</h3>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add required skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
              className="flex-1"
            />
            <Button onClick={addSkill} size="sm" className="bg-gradient-primary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Found Skills</h3>
              <Badge className="bg-gradient-success">
                {foundSkills.length} skills
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {foundSkills.map((skill) => (
                <Badge
                  key={skill.name}
                  variant={getSkillVariant(skill)}
                  className={getSkillBadgeClass(skill)}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Missing Skills</h3>
              <Badge variant="secondary">
                {missingSkills.length} missing
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill) => (
                <Badge key={skill} variant="destructive">
                  {skill}
                </Badge>
              ))}
              {missingSkills.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  All required skills found! 🎉
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};