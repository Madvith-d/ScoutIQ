import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FileText, Loader2, Search, Upload, XCircle } from 'lucide-react'
import { resumeAPI } from '@/services/api'
import { toast } from 'react-toastify'
import { useDashboard } from '@/components/context/DashboardContext'

export default function AnalyzePage() {
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)
  const { setCurrentAnalysis } = useDashboard()

  const validateFile = (file) => {
    const errors = []
    if (file.size > 5 * 1024 * 1024) errors.push('File size must be less than 5MB')
    const allowedExtensions = ['.docx', '.txt']
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/octet-stream',
    ]
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    const isValidExtension = allowedExtensions.includes(fileExtension)
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype)
    if (!isValidExtension && !isValidMimeType) errors.push('Only DOCX and TXT files are supported')
    return errors
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const errors = validateFile(file)
      if (errors.length > 0) {
        errors.forEach((err) => toast.error(err))
        e.target.value = ''
        return
      }
      setResumeFile(file)
      toast.success(`${file.name} uploaded successfully!`)
    }
  }

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      toast.error('Please upload a resume and provide a job description')
      return
    }
    setIsAnalyzing(true)
    setAnalysisError(null)
    const formData = new FormData()
    formData.append('resume', resumeFile)
    formData.append('jobDescription', jobDescription)
    try {
      const response = await resumeAPI.analyze(formData)
      setCurrentAnalysis(response)
      toast.success('Resume analyzed successfully! Go to Results to view details.')
    } catch (error) {
      const errorMessage = error.userMessage || 'Failed to analyze resume'
      setAnalysisError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analyze</h1>
        <p className="text-muted-foreground">Upload your resume and paste a job description</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            <span>Upload Resume</span>
          </CardTitle>
          <CardDescription>DOCX or TXT up to 5MB</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume File</Label>
            <div className="flex items-center gap-4">
              <Input id="resume" type="file" accept=".docx,.txt" onChange={handleFileChange} className="flex-1" />
              {resumeFile && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary">{resumeFile.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="secondary">DOCX</Badge>
              <Badge variant="secondary">TXT</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description</Label>
            <Textarea id="jobDescription" rows={6} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description here..." />
          </div>

          {analysisError && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-destructive">Analysis Failed</h4>
                  <p className="text-sm text-destructive mt-1">{analysisError}</p>
                </div>
              </div>
            </div>
          )}

          <Button onClick={handleAnalyze} disabled={isAnalyzing || !resumeFile || !jobDescription.trim()} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Analyze Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
