"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Activity,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  Settings,
  Eye,
  RefreshCw,
} from "lucide-react"

interface DashboardStats {
  totalWorkflows: number
  completedWorkflows: number
  processingWorkflows: number
  pendingWorkflows: number
  failedWorkflows: number
  avgResponseTime: string
  activeUsers: number
  departmentStats: Record<string, any>
}

interface WorkflowItem {
  id: string
  name: string
  type: string
  status: string
  department: string
  initiatedBy: string
  createdAt: string
  completedAt?: string
  duration?: string
}

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6b7280", "#8b5cf6"]

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkflows: 0,
    completedWorkflows: 0,
    processingWorkflows: 0,
    pendingWorkflows: 0,
    failedWorkflows: 0,
    avgResponseTime: "0h",
    activeUsers: 0,
    departmentStats: {},
  })

  const [recentWorkflows, setRecentWorkflows] = useState<WorkflowItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Simulate loading dashboard data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockStats: DashboardStats = {
        totalWorkflows: 156,
        completedWorkflows: 142,
        processingWorkflows: 8,
        pendingWorkflows: 6,
        failedWorkflows: 0,
        avgResponseTime: "2.3h",
        activeUsers: 45,
        departmentStats: {
          hr: { requests: 32, avgTime: "2.1h", satisfaction: 4.2 },
          academics: { requests: 28, avgTime: "1.8h", satisfaction: 4.5 },
          tnp: { requests: 41, avgTime: "3.2h", satisfaction: 4.1 },
          finance: { requests: 19, avgTime: "4.1h", satisfaction: 3.9 },
          it: { requests: 15, avgTime: "1.5h", satisfaction: 4.3 },
          admin: { requests: 21, avgTime: "2.8h", satisfaction: 4.0 },
        },
      }

      const mockWorkflows: WorkflowItem[] = [
        {
          id: "WF_001",
          name: "Internship Subject Swap - Batch 2024",
          type: "internship_swap",
          status: "completed",
          department: "academics",
          initiatedBy: "TnP Officer",
          createdAt: "2024-11-15T10:30:00Z",
          completedAt: "2024-11-15T14:45:00Z",
          duration: "4h 15m",
        },
        {
          id: "WF_002",
          name: "Annual Leave Request - Sarah Johnson",
          type: "leave_request",
          status: "processing",
          department: "hr",
          initiatedBy: "Sarah Johnson",
          createdAt: "2024-11-15T09:15:00Z",
        },
        {
          id: "WF_003",
          name: "Expense Reimbursement - Conference Travel",
          type: "expense_claim",
          status: "pending",
          department: "finance",
          initiatedBy: "Mike Chen",
          createdAt: "2024-11-15T08:20:00Z",
        },
        {
          id: "WF_004",
          name: "IT Support - Software Installation",
          type: "it_support",
          status: "completed",
          department: "it",
          initiatedBy: "Alice Brown",
          createdAt: "2024-11-14T16:30:00Z",
          completedAt: "2024-11-14T17:15:00Z",
          duration: "45m",
        },
        {
          id: "WF_005",
          name: "Grade Processing - Semester 5",
          type: "grade_processing",
          status: "processing",
          department: "academics",
          initiatedBy: "Prof. Wilson",
          createdAt: "2024-11-14T14:00:00Z",
        },
      ]

      setStats(mockStats)
      setRecentWorkflows(mockWorkflows)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const workflowStatusData = [
    { name: "Completed", value: stats.completedWorkflows, color: "#10b981" },
    { name: "Processing", value: stats.processingWorkflows, color: "#f59e0b" },
    { name: "Pending", value: stats.pendingWorkflows, color: "#6b7280" },
    { name: "Failed", value: stats.failedWorkflows, color: "#ef4444" },
  ]

  const departmentActivityData = Object.entries(stats.departmentStats).map(([dept, data]: [string, any]) => ({
    department: dept.toUpperCase(),
    requests: data.requests,
    avgTime: Number.parseFloat(data.avgTime),
    satisfaction: data.satisfaction,
  }))

  const weeklyTrendData = [
    { day: "Mon", workflows: 23, completed: 21 },
    { day: "Tue", workflows: 31, completed: 28 },
    { day: "Wed", workflows: 28, completed: 25 },
    { day: "Thu", workflows: 35, completed: 32 },
    { day: "Fri", workflows: 29, completed: 27 },
    { day: "Sat", workflows: 12, completed: 11 },
    { day: "Sun", workflows: 8, completed: 8 },
  ]

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "pending":
        return "outline"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor workflows, departments, and system performance</p>
        </div>
        <Button onClick={loadDashboardData} variant="outline" className="flex items-center gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkflows}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats.completedWorkflows / stats.totalWorkflows) * 100).toFixed(1)}%
            </div>
            <Progress value={(stats.completedWorkflows / stats.totalWorkflows) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">-15% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+8% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workflow Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Status Distribution</CardTitle>
                <CardDescription>Current status of all workflows in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={workflowStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {workflowStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Workflow Trend</CardTitle>
                <CardDescription>Workflow creation and completion over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="workflows" stroke="#8884d8" name="Created" />
                    <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Workflows */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Workflows</CardTitle>
              <CardDescription>Latest workflow activities across all departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-4">
                  {recentWorkflows.map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{workflow.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {workflow.department}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Initiated by {workflow.initiatedBy} • {formatDate(workflow.createdAt)}
                        </p>
                        {workflow.duration && (
                          <p className="text-xs text-muted-foreground">Duration: {workflow.duration}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(workflow.status)}>{workflow.status}</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Management</CardTitle>
              <CardDescription>Monitor and manage all system workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{stats.processingWorkflows} Processing</Badge>
                    <Badge variant="outline">{stats.pendingWorkflows} Pending</Badge>
                    {stats.failedWorkflows > 0 && <Badge variant="destructive">{stats.failedWorkflows} Failed</Badge>}
                  </div>
                  <Button variant="outline" size="sm">
                    View All Workflows
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentWorkflows
                    .filter((w) => w.status === "processing" || w.status === "pending")
                    .map((workflow) => (
                      <Card key={workflow.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{workflow.name}</CardTitle>
                            <Badge variant={getStatusBadgeVariant(workflow.status)} className="text-xs">
                              {workflow.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Department:</span>
                              <span className="capitalize">{workflow.department}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Initiated:</span>
                              <span>{formatDate(workflow.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span className="capitalize">{workflow.type.replace("_", " ")}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              <Settings className="h-3 w-3 mr-1" />
                              Manage
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Activity and performance metrics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={departmentActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#10b981" name="Requests" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(stats.departmentStats).map(([dept, data]: [string, any]) => (
              <Card key={dept}>
                <CardHeader>
                  <CardTitle className="capitalize">{dept}</CardTitle>
                  <CardDescription>Department performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Requests</span>
                    <span className="font-medium">{data.requests}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Response Time</span>
                    <span className="font-medium">{data.avgTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Satisfaction</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{data.satisfaction}</span>
                      <span className="text-xs text-muted-foreground">/5.0</span>
                    </div>
                  </div>
                  <Progress value={(data.satisfaction / 5) * 100} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Overall system performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Workflow Success Rate</span>
                  <span className="font-medium">98.7%</span>
                </div>
                <Progress value={98.7} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm">Agent Availability</span>
                  <span className="font-medium">95.2%</span>
                </div>
                <Progress value={95.2} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Performance</span>
                  <span className="font-medium">99.1%</span>
                </div>
                <Progress value={99.1} className="h-2" />

                <div className="flex items-center justify-between">
                  <span className="text-sm">User Satisfaction</span>
                  <span className="font-medium">4.2/5.0</span>
                </div>
                <Progress value={84} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Important trends and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Workflow Efficiency Up</p>
                    <p className="text-xs text-green-700">Average completion time decreased by 15% this week</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">High Demand Period</p>
                    <p className="text-xs text-blue-700">Internship workflows peak during semester transitions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Resource Optimization</p>
                    <p className="text-xs text-yellow-700">Consider adding capacity during peak hours (10-12 AM)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
