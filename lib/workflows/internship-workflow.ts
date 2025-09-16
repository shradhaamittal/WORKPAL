// Internship Subject Swap Workflow Implementation
// Handles the complete workflow for changing subjects for students going on internship

import { dbService } from "../database/connection"
import { agentManager } from "../agents/agent-manager"
import type { Workflow, WorkflowStep } from "../orchestrator"

export interface InternshipStudent {
  id: string
  name: string
  semester: number
  cgpa: number
  company: string
  startDate: string
  duration: number
  currentSubjects: string[]
  eligibilityStatus: "eligible" | "ineligible"
  eligibilityReasons?: string[]
}

export interface SubjectSwapRule {
  originalSubject: string
  replacementSubject: string
  credits: number
  reason: string
}

export interface InternshipWorkflowData {
  students: InternshipStudent[]
  swapRules: SubjectSwapRule[]
  approvalRequired: boolean
  approvedBy?: string
  approvalDate?: string
  completedAt?: string
}

export class InternshipWorkflow {
  private workflowId: string
  private data: InternshipWorkflowData
  private steps: WorkflowStep[]

  constructor(workflowId?: string) {
    this.workflowId = workflowId || `internship_swap_${Date.now()}`
    this.data = {
      students: [],
      swapRules: [],
      approvalRequired: true,
    }
    this.steps = this.initializeSteps()
  }

  private initializeSteps(): WorkflowStep[] {
    return [
      {
        id: "identify_students",
        department: "tnp",
        action: "Identify students going on internship this semester",
        status: "pending",
        data: {},
      },
      {
        id: "check_eligibility",
        department: "academics",
        action: "Check student eligibility for subject swap",
        status: "pending",
        dependencies: ["identify_students"],
        data: {},
      },
      {
        id: "apply_swap_rules",
        department: "academics",
        action: "Apply subject swap policy rules",
        status: "pending",
        dependencies: ["check_eligibility"],
        data: {},
      },
      {
        id: "request_approval",
        department: "admin",
        action: "Request approval from academic authority",
        status: "pending",
        dependencies: ["apply_swap_rules"],
        data: {},
      },
      {
        id: "update_records",
        department: "academics",
        action: "Update student subject records in database",
        status: "pending",
        dependencies: ["request_approval"],
        data: {},
      },
      {
        id: "notify_students",
        department: "admin",
        action: "Send notifications to affected students",
        status: "pending",
        dependencies: ["update_records"],
        data: {},
      },
    ]
  }

  async executeWorkflow(): Promise<Workflow> {
    const workflow: Workflow = {
      id: this.workflowId,
      name: "Internship Subject Swap Workflow",
      description: "Process subject changes for students going on internship as per university policy",
      steps: this.steps,
      status: "processing",
      requiredApprovals: ["academic_dean"],
    }

    // Execute each step in sequence
    for (const step of this.steps) {
      if (this.canExecuteStep(step)) {
        await this.executeStep(step)

        // Update workflow status
        if (step.status === "failed") {
          workflow.status = "failed"
          break
        }
      }
    }

    // Check if all steps completed successfully
    if (this.steps.every((step) => step.status === "completed")) {
      workflow.status = "completed"
      this.data.completedAt = new Date().toISOString()
    }

    // Save workflow to database
    await this.saveWorkflowToDatabase(workflow)

    return workflow
  }

  private canExecuteStep(step: WorkflowStep): boolean {
    if (!step.dependencies) return true

    return step.dependencies.every((depId) => {
      const depStep = this.steps.find((s) => s.id === depId)
      return depStep?.status === "completed"
    })
  }

  private async executeStep(step: WorkflowStep): Promise<void> {
    step.status = "processing"

    try {
      switch (step.id) {
        case "identify_students":
          await this.identifyInternshipStudents(step)
          break
        case "check_eligibility":
          await this.checkStudentEligibility(step)
          break
        case "apply_swap_rules":
          await this.applySubjectSwapRules(step)
          break
        case "request_approval":
          await this.requestApproval(step)
          break
        case "update_records":
          await this.updateStudentRecords(step)
          break
        case "notify_students":
          await this.notifyStudents(step)
          break
        default:
          throw new Error(`Unknown step: ${step.id}`)
      }

      step.status = "completed"
    } catch (error) {
      step.status = "failed"
      step.data = {
        ...step.data,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  private async identifyInternshipStudents(step: WorkflowStep): Promise<void> {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Get TnP agent to identify students
    const tnpAgent = agentManager.getAgent("tnp")
    if (!tnpAgent) throw new Error("TnP agent not available")

    // Get internship students from database
    const internshipData = await dbService.getInternshipStudents()

    const students: InternshipStudent[] = internshipData.map((student: any) => ({
      id: student.id,
      name: student.name,
      semester: student.semester,
      cgpa: student.cgpa,
      company: student.company_name || student.company_id,
      startDate: student.start_date,
      duration: student.duration_weeks,
      currentSubjects: ["Departmental Elective-2", "Open Elective", "Database Systems", "Software Engineering"],
      eligibilityStatus: "eligible",
    }))

    this.data.students = students

    step.data = {
      studentsFound: students.length,
      students: students.map((s) => ({
        id: s.id,
        name: s.name,
        company: s.company,
        startDate: s.startDate,
      })),
      message: `Successfully identified ${students.length} students going for internship`,
    }
  }

  private async checkStudentEligibility(step: WorkflowStep): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const academicsAgent = agentManager.getAgent("academics")
    if (!academicsAgent) throw new Error("Academics agent not available")

    // Check eligibility criteria for each student
    const eligibilityResults = this.data.students.map((student) => {
      const reasons: string[] = []
      let eligible = true

      // Check CGPA requirement (minimum 6.5)
      if (student.cgpa < 6.5) {
        eligible = false
        reasons.push(`CGPA ${student.cgpa} is below minimum requirement of 6.5`)
      }

      // Check semester requirement (minimum 5th semester)
      if (student.semester < 5) {
        eligible = false
        reasons.push(`Student in semester ${student.semester}, minimum 5th semester required`)
      }

      // Check internship duration (minimum 8 weeks)
      if (student.duration < 8) {
        eligible = false
        reasons.push(`Internship duration ${student.duration} weeks is below minimum 8 weeks`)
      }

      student.eligibilityStatus = eligible ? "eligible" : "ineligible"
      student.eligibilityReasons = reasons

      return {
        studentId: student.id,
        name: student.name,
        eligible,
        reasons,
      }
    })

    const eligibleCount = eligibilityResults.filter((r) => r.eligible).length
    const ineligibleCount = eligibilityResults.length - eligibleCount

    step.data = {
      totalStudents: eligibilityResults.length,
      eligibleStudents: eligibleCount,
      ineligibleStudents: ineligibleCount,
      eligibilityResults,
      message: `Eligibility check completed: ${eligibleCount} eligible, ${ineligibleCount} ineligible`,
    }
  }

  private async applySubjectSwapRules(step: WorkflowStep): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1800))

    // Get subject swap policy from database
    const policy = await dbService.getPolicyByName("Internship Subject Swap Policy", "academics")

    if (!policy) {
      throw new Error("Subject swap policy not found")
    }

    const swapRules = policy.rules.substitutions
    const eligibleStudents = this.data.students.filter((s) => s.eligibilityStatus === "eligible")

    // Apply swap rules to eligible students
    const subjectSwapRules: SubjectSwapRule[] = Object.entries(swapRules).map(([original, replacement]) => ({
      originalSubject: original,
      replacementSubject: replacement as string,
      credits: this.getSubjectCredits(replacement as string),
      reason: "Internship semester subject substitution as per university policy",
    }))

    this.data.swapRules = subjectSwapRules

    // Update student subjects
    eligibleStudents.forEach((student) => {
      student.currentSubjects = student.currentSubjects.map((subject) => {
        const swapRule = subjectSwapRules.find((rule) => rule.originalSubject === subject)
        return swapRule ? swapRule.replacementSubject : subject
      })
    })

    step.data = {
      swapRulesApplied: subjectSwapRules.length,
      affectedStudents: eligibleStudents.length,
      swapRules: subjectSwapRules,
      policyReference: policy.name,
      message: `Applied ${subjectSwapRules.length} subject swap rules to ${eligibleStudents.length} eligible students`,
    }
  }

  private async requestApproval(step: WorkflowStep): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate approval request to academic authority
    const approvalRequest = {
      workflowId: this.workflowId,
      requestType: "subject_swap_approval",
      studentsAffected: this.data.students.filter((s) => s.eligibilityStatus === "eligible").length,
      swapRules: this.data.swapRules,
      requestedBy: "Training & Placement Cell",
      requestDate: new Date().toISOString(),
      urgency: "normal",
      academicYear: "2024-25",
      semester: "6th Semester",
    }

    // Simulate approval (in real system, this would wait for actual approval)
    const approvalResponse = {
      status: "approved",
      approvedBy: "Dr. Sarah Johnson, Dean of Academics",
      approvalDate: new Date().toISOString(),
      approvalComments:
        "Approved as per university internship policy. Subject swaps are valid for internship semester.",
      approvalReference: `APPROVAL_${Date.now()}`,
    }

    this.data.approvedBy = approvalResponse.approvedBy
    this.data.approvalDate = approvalResponse.approvalDate

    step.data = {
      approvalRequest,
      approvalResponse,
      status: "approved",
      message: `Approval received from ${approvalResponse.approvedBy}`,
    }
  }

  private async updateStudentRecords(step: WorkflowStep): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const eligibleStudents = this.data.students.filter((s) => s.eligibilityStatus === "eligible")
    const updateResults = []

    // Simulate database updates for each eligible student
    for (const student of eligibleStudents) {
      const updateResult = {
        studentId: student.id,
        name: student.name,
        originalSubjects: ["Departmental Elective-2", "Open Elective"],
        newSubjects: ["Mobile Applications", "Project Report"],
        updateStatus: "success",
        updateTimestamp: new Date().toISOString(),
      }

      updateResults.push(updateResult)

      // In a real system, this would update the student_subjects table
      // await dbService.updateStudentSubjects(student.id, newSubjects)
    }

    step.data = {
      recordsUpdated: updateResults.length,
      updateResults,
      totalCreditsAffected: updateResults.length * 5, // Assuming 5 credits per swap
      message: `Successfully updated academic records for ${updateResults.length} students`,
    }
  }

  private async notifyStudents(step: WorkflowStep): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const eligibleStudents = this.data.students.filter((s) => s.eligibilityStatus === "eligible")
    const ineligibleStudents = this.data.students.filter((s) => s.eligibilityStatus === "ineligible")

    const notifications = []

    // Notifications for eligible students
    for (const student of eligibleStudents) {
      notifications.push({
        studentId: student.id,
        name: student.name,
        type: "subject_swap_confirmation",
        message: `Your subjects have been updated for the internship semester. Please check your academic portal for details.`,
        sentAt: new Date().toISOString(),
        status: "sent",
      })
    }

    // Notifications for ineligible students
    for (const student of ineligibleStudents) {
      notifications.push({
        studentId: student.id,
        name: student.name,
        type: "eligibility_notice",
        message: `Subject swap not applicable. Reasons: ${student.eligibilityReasons?.join(", ")}`,
        sentAt: new Date().toISOString(),
        status: "sent",
      })
    }

    step.data = {
      notificationsSent: notifications.length,
      eligibleNotifications: eligibleStudents.length,
      ineligibleNotifications: ineligibleStudents.length,
      notifications,
      message: `Sent ${notifications.length} notifications to students`,
    }
  }

  private getSubjectCredits(subjectName: string): number {
    // Mock credit mapping
    const creditMap: Record<string, number> = {
      "Mobile Applications": 3,
      "Project Report": 4,
      "Industry Project": 6,
    }
    return creditMap[subjectName] || 3
  }

  private async saveWorkflowToDatabase(workflow: Workflow): Promise<void> {
    try {
      await dbService.createWorkflow({
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        type: "internship_subject_swap",
        status: workflow.status,
        initiated_by: "system",
        data: this.data,
      })

      // Save workflow steps
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i]
        await dbService.createWorkflowStep({
          workflow_id: workflow.id,
          step_order: i + 1,
          department: step.department,
          action: step.action,
          status: step.status,
          data: step.data,
        })
      }
    } catch (error) {
      console.error("Failed to save workflow to database:", error)
    }
  }

  getWorkflowData(): InternshipWorkflowData {
    return this.data
  }

  getWorkflowId(): string {
    return this.workflowId
  }

  getSteps(): WorkflowStep[] {
    return this.steps
  }
}

// Factory function to create and execute internship workflow
export async function executeInternshipSubjectSwap(): Promise<Workflow> {
  const workflow = new InternshipWorkflow()
  return await workflow.executeWorkflow()
}

// Helper function to get workflow status
export async function getInternshipWorkflowStatus(workflowId: string): Promise<InternshipWorkflowData | null> {
  try {
    const workflowData = await dbService.query("SELECT * FROM workflows WHERE id = ?", [workflowId])
    if (workflowData.length > 0) {
      return workflowData[0].data as InternshipWorkflowData
    }
  } catch (error) {
    console.error("Failed to get workflow status:", error)
  }
  return null
}
