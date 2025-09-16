// Central Orchestrator System for WorkPal
// Handles query interpretation, task delegation, and workflow coordination

import { dbService } from "./database/connection"

export interface DepartmentAgent {
  id: string
  name: string
  capabilities: string[]
  status: "online" | "busy" | "offline"
  policies: Record<string, any>
}

export interface WorkflowStep {
  id: string
  department: string
  action: string
  status: "pending" | "processing" | "completed" | "failed"
  dependencies?: string[]
  data?: any
}

export interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  status: "pending" | "processing" | "completed" | "failed"
  requiredApprovals?: string[]
}

export class WorkPalOrchestrator {
  private departments: Map<string, DepartmentAgent> = new Map()
  private activeWorkflows: Map<string, Workflow> = new Map()

  constructor() {
    this.initializeDepartments()
  }

  private initializeDepartments() {
    const departments: DepartmentAgent[] = [
      {
        id: "hr",
        name: "Human Resources",
        capabilities: ["employee_management", "leave_requests", "policy_queries", "recruitment"],
        status: "online",
        policies: {
          leave_approval_limit: 30,
          requires_manager_approval: true,
        },
      },
      {
        id: "finance",
        name: "Finance",
        capabilities: ["expense_reimbursement", "budget_queries", "payment_processing", "financial_reports"],
        status: "online",
        policies: {
          reimbursement_limit: 5000,
          approval_required_above: 1000,
        },
      },
      {
        id: "academics",
        name: "Academics",
        capabilities: ["subject_management", "grade_processing", "curriculum_updates", "student_records"],
        status: "online",
        policies: {
          subject_swap_rules: {
            "Departmental Elective-2": "Mobile Applications",
            "Open Elective": "Project Report",
          },
        },
      },
      {
        id: "tnp",
        name: "Training & Placement",
        capabilities: ["internship_management", "placement_coordination", "company_relations", "student_tracking"],
        status: "online",
        policies: {
          internship_duration_min: 8,
          placement_eligibility_criteria: { cgpa: 7.0 },
        },
      },
      {
        id: "it",
        name: "IT Support",
        capabilities: ["system_maintenance", "user_support", "software_installation", "network_issues"],
        status: "busy",
        policies: {
          ticket_priority_levels: ["low", "medium", "high", "critical"],
        },
      },
      {
        id: "admin",
        name: "Administration",
        capabilities: ["approvals", "policy_enforcement", "reporting", "coordination"],
        status: "online",
        policies: {
          approval_authority: ["subject_changes", "policy_updates", "budget_allocations"],
        },
      },
    ]

    departments.forEach((dept) => {
      this.departments.set(dept.id, dept)
    })
  }

  async interpretQuery(query: string): Promise<{
    intent: string
    departments: string[]
    workflow?: Workflow
    confidence: number
  }> {
    // Simulate AI-powered query interpretation
    const lowerQuery = query.toLowerCase()

    // Internship subject swap workflow
    if (lowerQuery.includes("internship") && (lowerQuery.includes("subject") || lowerQuery.includes("change"))) {
      return {
        intent: "internship_subject_swap",
        departments: ["tnp", "academics", "admin"],
        workflow: this.createInternshipWorkflow(),
        confidence: 0.95,
      }
    }

    // Leave request workflow
    if (lowerQuery.includes("leave") || lowerQuery.includes("vacation")) {
      return {
        intent: "leave_request",
        departments: ["hr"],
        confidence: 0.9,
      }
    }

    // Expense reimbursement workflow
    if (lowerQuery.includes("reimbursement") || lowerQuery.includes("expense")) {
      return {
        intent: "expense_reimbursement",
        departments: ["finance", "hr"],
        confidence: 0.88,
      }
    }

    // IT support request
    if (lowerQuery.includes("it") || lowerQuery.includes("computer") || lowerQuery.includes("software")) {
      return {
        intent: "it_support",
        departments: ["it"],
        confidence: 0.85,
      }
    }

    // General query - route to most relevant department
    return {
      intent: "general_inquiry",
      departments: ["admin"],
      confidence: 0.6,
    }
  }

  private createInternshipWorkflow(): Workflow {
    const workflowId = `internship_${Date.now()}`

    const workflow: Workflow = {
      id: workflowId,
      name: "Internship Subject Swap",
      description: "Process subject changes for students going on internship",
      status: "pending",
      requiredApprovals: ["admin"],
      steps: [
        {
          id: "step1",
          department: "tnp",
          action: "Identify students going on internship",
          status: "pending",
        },
        {
          id: "step2",
          department: "academics",
          action: "Apply subject swap policy rules",
          status: "pending",
          dependencies: ["step1"],
        },
        {
          id: "step3",
          department: "admin",
          action: "Request approval for subject changes",
          status: "pending",
          dependencies: ["step2"],
        },
        {
          id: "step4",
          department: "academics",
          action: "Update student database with new subjects",
          status: "pending",
          dependencies: ["step3"],
        },
      ],
    }

    this.activeWorkflows.set(workflowId, workflow)
    return workflow
  }

  async executeWorkflow(workflowId: string): Promise<void> {
    const workflow = this.activeWorkflows.get(workflowId)
    if (!workflow) throw new Error("Workflow not found")

    workflow.status = "processing"

    await dbService.createWorkflow({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      type: workflow.name.toLowerCase().replace(/\s+/g, "_"),
      status: workflow.status,
      initiated_by: "system",
      data: { steps: workflow.steps },
    })

    // Execute steps in dependency order
    for (const step of workflow.steps) {
      if (this.canExecuteStep(step, workflow)) {
        await this.executeStep(step, workflow)

        await dbService.createWorkflowStep({
          workflow_id: workflow.id,
          step_order: workflow.steps.indexOf(step) + 1,
          department: step.department,
          action: step.action,
          status: step.status,
          data: step.data,
        })
      }
    }

    if (workflow.steps.every((s) => s.status === "completed")) {
      workflow.status = "completed"
      await dbService.updateWorkflowStatus(workflow.id, "completed")
    }
  }

  private canExecuteStep(step: WorkflowStep, workflow: Workflow): boolean {
    if (!step.dependencies) return true

    return step.dependencies.every((depId) => {
      const depStep = workflow.steps.find((s) => s.id === depId)
      return depStep?.status === "completed"
    })
  }

  private async executeStep(step: WorkflowStep, workflow: Workflow): Promise<void> {
    step.status = "processing"

    // Simulate department processing
    const department = this.departments.get(step.department.toLowerCase().replace(/\s+/g, ""))

    if (department) {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Apply department-specific logic
      switch (step.department.toLowerCase()) {
        case "tnp":
        case "training & placement":
          step.data = await this.processTnPStep(step)
          break
        case "academics":
          step.data = await this.processAcademicsStep(step)
          break
        case "admin":
        case "administration":
          step.data = await this.processAdminStep(step)
          break
      }

      step.status = "completed"
    } else {
      step.status = "failed"
    }
  }

  private async processTnPStep(step: WorkflowStep): Promise<any> {
    if (step.action.includes("Identify")) {
      const internStudents = await dbService.getInternshipStudents()
      return {
        internStudents: internStudents.map((student: any) => ({
          id: student.id,
          name: student.name,
          company: student.company_name,
          startDate: student.start_date,
          duration: student.duration_weeks,
        })),
      }
    }
    return {}
  }

  private async processAcademicsStep(step: WorkflowStep): Promise<any> {
    // Simulate Academics department processing
    const academicsDept = this.departments.get("academics")

    if (step.action.includes("Apply subject swap")) {
      return {
        subjectChanges: academicsDept?.policies.subject_swap_rules,
        affectedStudents: 3,
      }
    }

    if (step.action.includes("Update student database")) {
      return {
        updatedRecords: 3,
        timestamp: new Date().toISOString(),
      }
    }

    return {}
  }

  private async processAdminStep(step: WorkflowStep): Promise<any> {
    // Simulate Admin department processing
    if (step.action.includes("approval")) {
      return {
        approvalStatus: "approved",
        approvedBy: "Dean of Academics",
        approvalDate: new Date().toISOString(),
      }
    }
    return {}
  }

  getDepartmentStatus(departmentId: string): DepartmentAgent | undefined {
    return this.departments.get(departmentId)
  }

  getWorkflowStatus(workflowId: string): Workflow | undefined {
    return this.activeWorkflows.get(workflowId)
  }

  getAllDepartments(): DepartmentAgent[] {
    return Array.from(this.departments.values())
  }

  getActiveWorkflows(): Workflow[] {
    return Array.from(this.activeWorkflows.values())
  }
}

// Singleton instance
export const orchestrator = new WorkPalOrchestrator()
