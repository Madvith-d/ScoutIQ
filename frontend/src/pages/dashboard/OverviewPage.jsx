import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Calendar, TrendingUp } from 'lucide-react'
import { resumeAPI, healthAPI } from '@/services/api'
import { toast } from 'react-toastify'

export default function OverviewPage() {
  const [stats, setStats] = useState({ totalAnalyses: 0, averageScore: 0, thisMonth: 0 })

  useEffect(() => {
    const init = async () => {
      try {
        await healthAPI.check()
        const res = await resumeAPI.getStats()
        setStats(res.stats)
      } catch (e) {
        toast.error('Backend not available right now')
      }
    }
    init()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Your analysis summary and recent activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
            <p className="text-xs text-muted-foreground">+{stats.thisMonth} this month</p>
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
            <p className="text-xs text-muted-foreground">analyses completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tips</CardTitle>
          <CardDescription>Upload a resume and a job description to see your results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>DOCX and TXT formats are supported (max 5MB)</li>
              <li>Higher ATS scores indicate closer matching to the job</li>
              <li>Use the History page to revisit past analyses</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
