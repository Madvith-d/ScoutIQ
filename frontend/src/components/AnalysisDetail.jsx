import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Download,
  Plus,
  Star,
  CheckCircle,
  AlertTriangle,
  Calendar,
  FileText,
  Award,
  ArrowLeft
} from 'lucide-react';

const AnalysisDetail = ({ 
  analysis, 
  onBack, 
  onNewAnalysis, 
  showBackButton = false,
  showNewAnalysisButton = true 
}) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-accent-foreground';
    return 'text-destructive';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return <Badge className="bg-accent text-accent-foreground">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-secondary text-secondary-foreground">Good</Badge>;
    return <Badge className="bg-destructive/10 text-destructive">Needs Work</Badge>;
  };

  if (!analysis) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No analysis data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button if needed */}
      {showBackButton && (
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to History</span>
          </Button>
        </div>
      )}

      {/* Analysis Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-xl">Analysis Results</CardTitle>
                <CardDescription>
                  {analysis.fileName && (
                    <div className="flex items-center space-x-2 mt-1">
                      <FileText className="h-4 w-4" />
                      <span>{analysis.fileName}</span>
                    </div>
                  )}
                  {analysis.createdAt && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(analysis.createdAt).toLocaleDateString()} at {new Date(analysis.createdAt).toLocaleTimeString()}</span>
                    </div>
                  )}
                </CardDescription>
              </div>
            </div>
            {analysis.analysis?.ats_score !== undefined && (
              <div className="text-right">
                {getScoreBadge(analysis.analysis.ats_score)}
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* ATS Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ATS Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Overall Match Score</Label>
            <span className={`text-3xl font-bold ${getScoreColor(analysis.analysis?.ats_score || 0)}`}>
              {analysis.analysis?.ats_score || 0}%
            </span>
          </div>
          <Progress value={analysis.analysis?.ats_score || 0} className="h-3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {analysis.analysis?.matched_keywords?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Matched Keywords</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-destructive">
                {analysis.analysis?.missing_keywords?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Missing Keywords</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {analysis.analysis?.improvements?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Recommendations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {analysis.analysis?.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {analysis.analysis.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Strengths */}
      {analysis.analysis?.strengths?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Strengths</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.analysis.strengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-accent rounded-lg border border-border">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weaknesses */}
      {analysis.analysis?.weaknesses?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-accent-foreground" />
              <span>Areas for Improvement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.analysis.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg border border-border">
                  <AlertTriangle className="h-5 w-5 text-accent-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{weakness}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {analysis.analysis?.improvements?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.analysis.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg border border-border">
                  <Star className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{improvement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analysis.analysis?.matched_keywords?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Matched Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.analysis.matched_keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="border-border">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {analysis.analysis?.missing_keywords?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Missing Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.analysis.missing_keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="border-border">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Job Description (if available) */}
      {analysis.jobDescription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {analysis.jobDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <Button className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            {showNewAnalysisButton && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onNewAnalysis}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisDetail;
