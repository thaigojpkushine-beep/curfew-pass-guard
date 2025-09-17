import { Pass } from "@/types/Pass";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface AdminAnalyticsProps {
  passes: Pass[];
}

export function AdminAnalytics({ passes }: AdminAnalyticsProps) {
  // Calculate analytics
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const todayPasses = passes.filter(p => 
    new Date(p.createdAt).toDateString() === today.toDateString()
  ).length;

  const yesterdayPasses = passes.filter(p => 
    new Date(p.createdAt).toDateString() === yesterday.toDateString()
  ).length;

  const weeklyPasses = passes.filter(p => 
    new Date(p.createdAt) >= lastWeek
  ).length;

  const approvalRate = passes.length > 0 
    ? (passes.filter(p => p.status === 'approved').length / passes.length * 100).toFixed(1)
    : 0;

  const avgProcessingTime = passes
    .filter(p => p.approvedAt)
    .reduce((acc, p) => {
      const processing = p.approvedAt!.getTime() - p.createdAt.getTime();
      return acc + processing;
    }, 0) / passes.filter(p => p.approvedAt).length;

  const avgProcessingHours = avgProcessingTime ? (avgProcessingTime / (1000 * 60 * 60)).toFixed(1) : 0;

  // Status distribution
  const statusCounts = {
    pending: passes.filter(p => p.status === 'pending').length,
    approved: passes.filter(p => p.status === 'approved').length,
    denied: passes.filter(p => p.status === 'denied').length,
    expired: passes.filter(p => p.status === 'expired').length,
  };

  // Recent activity (last 5 passes)
  const recentActivity = passes
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // Popular reasons
  const reasonCounts: Record<string, number> = {};
  passes.forEach(pass => {
    const reason = pass.reason.toLowerCase();
    if (reason.includes('medical')) reasonCounts.medical = (reasonCounts.medical || 0) + 1;
    else if (reason.includes('work') || reason.includes('employment')) reasonCounts.work = (reasonCounts.work || 0) + 1;
    else if (reason.includes('emergency')) reasonCounts.emergency = (reasonCounts.emergency || 0) + 1;
    else if (reason.includes('family')) reasonCounts.family = (reasonCounts.family || 0) + 1;
    else reasonCounts.other = (reasonCounts.other || 0) + 1;
  });

  const topReasons = Object.entries(reasonCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-primary">{todayPasses}</div>
                <div className="text-sm text-muted-foreground">Today's Requests</div>
              </div>
              <div className="text-right">
                {todayPasses > yesterdayPasses ? (
                  <div className="flex items-center text-success text-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{((todayPasses - yesterdayPasses) / Math.max(yesterdayPasses, 1) * 100).toFixed(0)}%
                  </div>
                ) : (
                  <div className="flex items-center text-destructive text-sm">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {yesterdayPasses > 0 ? Math.abs((todayPasses - yesterdayPasses) / yesterdayPasses * 100).toFixed(0) : 0}%
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-success">{approvalRate}%</div>
                <div className="text-sm text-muted-foreground">Approval Rate</div>
              </div>
              <CheckCircle className="h-8 w-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-accent">{avgProcessingHours}h</div>
                <div className="text-sm text-muted-foreground">Avg. Processing</div>
              </div>
              <Clock className="h-8 w-8 text-accent opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-warning">{weeklyPasses}</div>
                <div className="text-sm text-muted-foreground">This Week</div>
              </div>
              <Users className="h-8 w-8 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Pass Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{statusCounts.pending}</div>
                  <Badge variant="outline" className="text-xs">
                    {passes.length > 0 ? (statusCounts.pending / passes.length * 100).toFixed(1) : 0}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{statusCounts.approved}</div>
                  <Badge variant="outline" className="text-xs">
                    {passes.length > 0 ? (statusCounts.approved / passes.length * 100).toFixed(1) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Denied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{statusCounts.denied}</div>
                  <Badge variant="outline" className="text-xs">
                    {passes.length > 0 ? (statusCounts.denied / passes.length * 100).toFixed(1) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Expired</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{statusCounts.expired}</div>
                  <Badge variant="outline" className="text-xs">
                    {passes.length > 0 ? (statusCounts.expired / passes.length * 100).toFixed(1) : 0}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Reasons */}
        <Card>
          <CardHeader>
            <CardTitle>Most Common Reasons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topReasons.map(([reason, count], index) => (
              <div key={reason} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm capitalize">{reason}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">{count}</div>
                  <Badge variant="outline" className="text-xs">
                    {passes.length > 0 ? (count / passes.length * 100).toFixed(1) : 0}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((pass) => (
                <div key={pass.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {pass.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{pass.fullName}</div>
                      <div className="text-xs text-muted-foreground">
                        {pass.createdAt.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {pass.status === 'approved' && (
                      <Badge className="bg-success text-success-foreground">Approved</Badge>
                    )}
                    {pass.status === 'pending' && (
                      <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                    )}
                    {pass.status === 'denied' && (
                      <Badge className="bg-destructive text-destructive-foreground">Denied</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity to display
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}