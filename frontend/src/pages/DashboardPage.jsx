import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Search, 
  History, 
  TrendingUp, 
  User, 
  Calendar,
  Download,
  Eye,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  BarChart3,
  Target,
  Award,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { resumeAPI, healthAPI } from '../services/api';
import { auth } from '../firebase';
import AnalysisDetail from '../components/AnalysisDetail';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [viewingHistoricalAnalysis, setViewingHistoricalAnalysis] = useState(false);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    thisMonth: 0
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // Add a small delay to ensure Firebase auth is fully initialized
        setTimeout(async () => {
          try {
            // Check if backend is accessible
            await healthAPI.check();
            fetchAnalysisHistory();
            fetchStats();
          } catch (error) {
            console.error('Backend health check failed:', error);
            toast.error('Backend service is not available. Please try again later.');
          }
        }, 1000);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAnalysisHistory = async () => {
    try {
      const response = await resumeAPI.getHistory();
      setAnalysisHistory(response.analyses || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      // Don't show error toast for history fetch failures
      // Just set empty array to avoid breaking the UI
      setAnalysisHistory([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await resumeAPI.getStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to empty stats
      setStats({
        totalAnalyses: 0,
        averageScore: 0,
        thisMonth: 0
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Debug: Log file details
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        mimetype: file.mimetype
      });
      
      const errors = validateFile(file);
      
      if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
        e.target.value = ''; // Clear the input
        return;
      }
      
      setResumeFile(file);
      toast.success(`${file.name} uploaded successfully!`);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      toast.error('Please upload a resume and provide a job description');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null); // Clear any previous errors
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await resumeAPI.analyze(formData);
      setCurrentAnalysis(response);
      setAnalysisError(null);
      toast.success('Resume analyzed successfully!');
      fetchAnalysisHistory();
      fetchStats();
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error.userMessage || 'Failed to analyze resume';
      setAnalysisError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewAnalysis = async (analysisId) => {
    try {
      const response = await resumeAPI.getAnalysis(analysisId);
      setCurrentAnalysis(response.analysis);
      setViewingHistoricalAnalysis(true);
      toast.success('Analysis loaded successfully!');
    } catch (error) {
      console.error('Error loading analysis:', error);
      toast.error('Failed to load analysis details');
    }
  };

  const handleBackToHistory = () => {
    setViewingHistoricalAnalysis(false);
    setCurrentAnalysis(null);
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
    setResumeFile(null);
    setJobDescription('');
    setAnalysisError(null);
    setViewingHistoricalAnalysis(false);
    // Switch to analyze tab
    const analyzeTab = document.querySelector('[data-value="analyze"]');
    if (analyzeTab) {
      analyzeTab.click();
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Work</Badge>;
  };

  const validateFile = (file) => {
    const errors = [];
    
    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      errors.push('File size must be less than 5MB');
    }
    
    // Check file type by extension and MIME type
    const allowedExtensions = ['.docx', '.txt'];
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'text/plain', // .txt
      'application/octet-stream' // Sometimes .docx files have this MIME type
    ];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    const isValidExtension = allowedExtensions.includes(fileExtension);
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
    
    if (!isValidExtension && !isValidMimeType) {
      errors.push('Only DOCX and TXT files are supported');
    }
    
    return errors;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">ScoutIQ</h1>
              </div>
              <Badge variant="secondary">Resume Analyzer</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.email}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => auth.signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.thisMonth} this month
              </p>
            </CardContent>
          </Card>
                     <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Average Score</CardTitle>
               <TrendingUp className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stats.averageScore}%</div>
               <p className="text-xs text-muted-foreground">
                 {stats.totalAnalyses > 0 ? `${stats.totalAnalyses} analyses` : 'No analyses yet'}
               </p>
             </CardContent>
           </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
              <p className="text-xs text-muted-foreground">
                analyses completed
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analyze" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analyze">Analyze Resume</TabsTrigger>
            <TabsTrigger value="history">Analysis History</TabsTrigger>
            <TabsTrigger value="results">Current Results</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload Resume</span>
                </CardTitle>
                <CardDescription>
                  Upload your resume and provide a job description to get AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume File</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        id="resume"
                        type="file"
                        accept=".docx,.txt"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                      {resumeFile && (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">{resumeFile.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Supported formats: DOCX, TXT (Max 5MB)
                      </p>
                      <div className="flex items-center space-x-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600">DOCX</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600">TXT</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-red-600">PDF (Coming Soon)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the job description here to analyze how well your resume matches..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={6}
                  />
                </div>

                                 {analysisError && (
                   <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                     <div className="flex items-start space-x-3">
                       <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                       <div className="flex-1">
                         <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                           Analysis Failed
                         </h4>
                         <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                           {analysisError}
                         </p>
                         <div className="mt-3 text-xs text-red-600 dark:text-red-400">
                           <p>• Make sure your file is in DOCX or TXT format</p>
                           <p>• Check that your file is under 5MB</p>
                           <p>• Ensure you have a stable internet connection</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

                 <Button 
                   onClick={handleAnalyze} 
                   disabled={isAnalyzing || !resumeFile || !jobDescription.trim()}
                   className="w-full"
                 >
                   {isAnalyzing ? (
                     <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       Analyzing...
                     </>
                   ) : (
                     <>
                       <Search className="mr-2 h-4 w-4" />
                       Analyze Resume
                     </>
                   )}
                 </Button>
              </CardContent>
            </Card>
          </TabsContent>

                    <TabsContent value="history" className="space-y-6">
            {viewingHistoricalAnalysis ? (
              <AnalysisDetail
                analysis={currentAnalysis}
                onBack={handleBackToHistory}
                onNewAnalysis={handleNewAnalysis}
                showBackButton={true}
                showNewAnalysisButton={true}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="h-5 w-5" />
                    <span>Analysis History</span>
                  </CardTitle>
                  <CardDescription>
                    View your previous resume analyses and results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analysisHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No analyses yet. Upload your first resume to get started!</p>
                    </div>
                  ) : (
                                         <div className="space-y-4">
                       {analysisHistory.map((analysis) => (
                         <div key={analysis.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group" onClick={() => handleViewAnalysis(analysis.id)}>
                           <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                               <div className="relative">
                                 <FileText className="h-5 w-5 text-blue-600" />
                                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                               </div>
                               <div>
                                 <h3 className="font-medium group-hover:text-blue-600 transition-colors">{analysis.fileName}</h3>
                                 <p className="text-sm text-gray-500">
                                   {new Date(analysis.createdAt).toLocaleDateString()} at {new Date(analysis.createdAt).toLocaleTimeString()}
                                 </p>
                                 <div className="flex items-center space-x-2 mt-1">
                                   <span className="text-xs text-gray-400">File size: {(analysis.fileSize / 1024).toFixed(1)} KB</span>
                                   <span className="text-xs text-gray-400">•</span>
                                   <span className="text-xs text-gray-400">{analysis.analysis?.matched_keywords?.length || 0} keywords matched</span>
                                 </div>
                               </div>
                             </div>
                             <div className="flex items-center space-x-3">
                               {getScoreBadge(analysis.analysis?.ats_score || 0)}
                               <Button 
                                 variant="outline" 
                                 size="sm"
                                 className="group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleViewAnalysis(analysis.id);
                                 }}
                               >
                                 <Eye className="h-4 w-4" />
                                 <span className="ml-1">View Details</span>
                               </Button>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

                    <TabsContent value="results" className="space-y-6">
            {currentAnalysis ? (
              <AnalysisDetail
                analysis={currentAnalysis}
                onNewAnalysis={handleNewAnalysis}
                showBackButton={false}
                showNewAnalysisButton={true}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No analysis results yet. Upload a resume to see your results here!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
