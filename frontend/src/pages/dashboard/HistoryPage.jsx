import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Eye, History as HistoryIcon } from 'lucide-react'
import { resumeAPI } from '@/services/api'
import { useNavigate } from 'react-router'
import { useDashboard } from '@/components/context/DashboardContext'

export default function HistoryPage() {
  const [analysisHistory, setAnalysisHistory] = useState([])
  const navigate = useNavigate()
  const { setCurrentAnalysis } = useDashboard()

  useEffect(() => {
    const load = async () => {
      try {
        const response = await resumeAPI.getHistory()
        setAnalysisHistory(response.analyses || [])
      } catch (e) {
        setAnalysisHistory([])
      }
    }
    load()
  }, [])

  const handleView = async (id) => {
    try {
      const response = await resumeAPI.getAnalysis(id)
      setCurrentAnalysis(response.analysis)
      navigate('/dashboard/results')
    } catch (e) {
      // no-op; could show toast
    }
  }

  const getScoreBadge = (score) => {
    if (score >= 80) return <Badge className="bg-accent text-accent-foreground">Excellent</Badge>
    if (score >= 60) return <Badge className="bg-secondary text-secondary-foreground">Good</Badge>
    return <Badge className="bg-destructive/10 text-destructive">Needs Work</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">History</h1>
        <p className="text-muted-foreground">View your previous resume analyses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5" />
            <span>Analysis History</span>
          </CardTitle>
          <CardDescription>Your stored analyses with ATS scores</CardDescription>
        </CardHeader>
        <CardContent>
          {analysisHistory.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No analyses yet. Upload your first resume to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analysisHistory.map((analysis) => (
                <div key={analysis.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer group" onClick={() => handleView(analysis.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium group-hover:text-primary transition-colors">{analysis.fileName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(analysis.createdAt).toLocaleDateString()} at {new Date(analysis.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getScoreBadge(analysis.analysis?.ats_score || 0)}
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleView(analysis.id) }}>
                        <Eye className="h-4 w-4" />
                        <span className="ml-1">View</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
