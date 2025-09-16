import { BaseAgent, type AgentAction } from "./base-agent"

export class HRAgent extends BaseAgent {
  constructor() {
    super("hr", "Human Resources")
    this.initialize()
  }

  initialize(): void {
    this.capabilities = [
      {
        name: "leave_request",
        description: "Process employee leave requests",
        requiredParams: ["employeeId", "startDate", "endDate", "leaveType"],
        optionalParams: ["reason", "emergencyContact"],
      },
      {
        name: "employee_management",
        description: "Manage employee records and information",
        requiredParams: ["employeeId"],
        optionalParams: ["action", "data"],
      },
      {
        name: "policy_queries",
        description: "Answer questions about HR policies",
        requiredParams: ["policyType"],
      },
      {
        name: "recruitment",
        description: "Handle recruitment and hiring processes",
        requiredParams: ["position", "requirements"],
      },
    ]

    this.policies = [
      {
        name: "leave_approval",
        description: "Rules for leave approval process",
        rules: {
          maxConsecutiveDays: 30,
          requiresManagerApproval: true,
          minimumNotice: 7, // days
          blackoutPeriods: ["2024-12-15:2024-12-31", "2024-04-01:2024-04-15"],
        },
      },
      {
        name: "employee_benefits",
        description: "Employee benefits and entitlements",
        rules: {
          annualLeave: 21,
          sickLeave: 10,
          maternityLeave: 180,
          paternityLeave: 15,
        },
      },
    ]
  }

  async processAction(action: AgentAction): Promise<AgentAction> {
    this.setStatus("busy")

    try {
      switch (action.type) {
        case "leave_request":
          return await this.processLeaveRequest(action)
        case "employee_management":
          return await this.processEmployeeManagement(action)
        case "policy_queries":
          return await this.processPolicyQuery(action)
        case "recruitment":
          return await this.processRecruitment(action)
        default:
          throw new Error(`Unknown action type: ${action.type}`)
      }
    } catch (error) {
      action.status = "failed"
      action.error = error instanceof Error ? error.message : "Unknown error"
      return action
    } finally {
      this.setStatus("online")
    }
  }

  private async processLeaveRequest(action: AgentAction): Promise<AgentAction> {
    action.status = "processing"

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const leaveData = action.result
    const policy = this.applyPolicy("leave_approval", leaveData)

    // Validate leave request against policy
    const startDate = new Date(leaveData.startDate)
    const endDate = new Date(leaveData.endDate)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    let approvalRequired = false
    const warnings: string[] = []

    if (daysDiff > policy.appliedRules.maxConsecutiveDays) {
      warnings.push(`Leave duration exceeds maximum of ${policy.appliedRules.maxConsecutiveDays} days`)
      approvalRequired = true
    }

    if (policy.appliedRules.requiresManagerApproval) {
      approvalRequired = true
    }

    // Check blackout periods
    const isInBlackout = policy.appliedRules.blackoutPeriods.some((period: string) => {
      const [start, end] = period.split(":")
      const blackoutStart = new Date(start)
      const blackoutEnd = new Date(end)
      return startDate <= blackoutEnd && endDate >= blackoutStart
    })

    if (isInBlackout) {
      warnings.push("Leave request falls within blackout period")
      approvalRequired = true
    }

    action.result = {
      ...leaveData,
      approvalRequired,
      warnings,
      estimatedApprovalTime: approvalRequired ? "2-3 business days" : "Immediate",
      status: approvalRequired ? "pending_approval" : "approved",
    }

    action.status = "completed"
    return action
  }

  private async processEmployeeManagement(action: AgentAction): Promise<AgentAction> {
    action.status = "processing"
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate employee data retrieval/update
    action.result = {
      ...action.result,
      employeeInfo: {
        id: action.result.employeeId,
        name: "John Doe",
        department: "Engineering",
        position: "Software Developer",
        joinDate: "2023-01-15",
        manager: "Jane Smith",
      },
      lastUpdated: new Date().toISOString(),
    }

    action.status = "completed"
    return action
  }

  private async processPolicyQuery(action: AgentAction): Promise<AgentAction> {
    action.status = "processing"
    await new Promise((resolve) => setTimeout(resolve, 800))

    const policyType = action.result.policyType
    const policy = this.policies.find((p) => p.name.includes(policyType))

    action.result = {
      ...action.result,
      policyInfo: policy || { message: "Policy not found" },
      responseGenerated: new Date().toISOString(),
    }

    action.status = "completed"
    return action
  }

  private async processRecruitment(action: AgentAction): Promise<AgentAction> {
    action.status = "processing"
    await new Promise((resolve) => setTimeout(resolve, 1200))

    action.result = {
      ...action.result,
      jobPosting: {
        id: `JOB_${Date.now()}`,
        position: action.result.position,
        requirements: action.result.requirements,
        status: "draft",
        createdDate: new Date().toISOString(),
      },
      nextSteps: ["Review job description", "Post to job boards", "Schedule interviews"],
    }

    action.status = "completed"
    return action
  }
}
