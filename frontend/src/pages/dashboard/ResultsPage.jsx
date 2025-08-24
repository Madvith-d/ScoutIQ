import AnalysisDetail from '@/components/AnalysisDetail'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { useDashboard } from '@/components/context/DashboardContext'

export default function ResultsPage() {
  const { currentAnalysis } = useDashboard()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Results</h1>
        <p className="text-muted-foreground">Your latest analysis details</p>
      </div>

      {currentAnalysis ? (
        <AnalysisDetail analysis={currentAnalysis} showBackButton={false} showNewAnalysisButton={false} />
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No analysis results yet. Go to Analyze to run an analysis.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
