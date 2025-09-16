"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Users, GraduationCap, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { chatService } from "@/lib/chat-service"

export function WorkflowDemo() {
  const [isRunning, setIsRunning] = useState(false)
  const [demoCompleted, setDemoCompleted] = useState(false)

  const handleRunDemo = async () => {
    setIsRunning(true)
    setDemoCompleted(false)

    try {
      await chatService.triggerInternshipWorkflow()

      // Simulate completion after workflow steps
      setTimeout(() => {
        setIsRunning(false)
        setDemoCompleted(true)
      }, 8000)
    } catch (error) {
      console.error("Demo failed:", error)
      setIsRunning(false)
    }
  }

  const workflowSteps = [
    {
      id: 1,
      department: "Training & Placement",
      action: "Identify students going on internship",
      icon: Users,
      description: "Find all students registered for internship this semester",
      status: demoCompleted ? "completed" : isRunning ? "processing" : "pending",
    },
    {
      id: 2,
      department: "Academics",
      action: "Check eligibility criteria",
      icon: GraduationCap,
      description: "Verify CGPA, semester, and other requirements",
      status: demoCompleted ? "completed" : "pending",
    },
    {
      id: 3,
      department: "Academics",
      action: "Apply subject swap rules",
      icon: GraduationCap,
      description: "Replace subjects according to university policy",
      status: demoCompleted ? "completed" : "pending",
    },
    {
      id: 4,
      department: "Administration",
      action: "Request approval",
      icon: CheckCircle,
      description: "Get approval from academic authority",
      status: demoCompleted ? "completed" : "pending",
    },
    {
      id: 5,
      department: "Academics",
      action: "Update student records",
      icon: GraduationCap,
      description: "Update database with new subject assignments",
      status: demoCompleted ? "completed" : "pending",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
      case "pending":
        return <Clock className="h-4 w-4 text-gray-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "processing":
        return "bg-yellow-500 animate-pulse"
      case "pending":
        return "bg-gray-300"
      default:
        return "bg-red-500"
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Internship Subject Swap Workflow Demo
        </CardTitle>
        <CardDescription>
          Experience how WorkPal coordinates between departments to handle complex administrative tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Workflow Example</h3>
            <p className="text-sm text-muted-foreground">
              "Change the subjects for students going on internship this semester as per policy"
            </p>
          </div>
          <Button onClick={handleRunDemo} disabled={isRunning} className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            {isRunning ? "Running Demo..." : "Run Demo"}
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Workflow Steps</h4>
          <div className="space-y-3">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4 p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(step.status)}`} />
                  <step.icon className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{step.department}</span>
                    <Badge variant="outline" className="text-xs">
                      Step {step.id}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{step.action}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusIcon(step.status)}
                  <Badge variant={step.status === "completed" ? "default" : "secondary"} className="text-xs">
                    {step.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {demoCompleted && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Workflow Completed Successfully!</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p>• 3 students identified for internship</p>
              <p>• Subject swap rules applied: Departmental Elective-2 → Mobile Applications</p>
              <p>• Open Elective → Project Report</p>
              <p>• Approval received from Dean of Academics</p>
              <p>• Student records updated in database</p>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>
            This demo shows how WorkPal's AI orchestrator coordinates between Training & Placement, Academics, and
            Administration departments to complete complex workflows automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
