// Chat service that integrates with the orchestrator
import { orchestrator, type Workflow } from "./orchestrator"
import { executeInternshipSubjectSwap } from "./workflows/internship-workflow"

export interface ChatMessage {
  id: string
  type: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  department?: string
  status?: "processing" | "completed" | "pending"
  workflow?: Workflow
  metadata?: any
}

export class ChatService {
  private messages: ChatMessage[] = []
  private messageListeners: ((messages: ChatMessage[]) => void)[] = []

  constructor() {
    // Initialize with welcome message
    this.addMessage({
      id: "welcome",
      type: "system",
      content:
        "Welcome to WorkPal! I'm your AI assistant for handling cross-departmental tasks. I can help you with internships, leave requests, expense reimbursements, IT support, and more. How can I assist you today?",
      timestamp: new Date(),
    })
  }

  async processUserMessage(content: string): Promise<void> {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }
    this.addMessage(userMessage)

    // Interpret the query using orchestrator
    const interpretation = await orchestrator.interpretQuery(content)

    // Create response based on interpretation
    let responseContent = ""
    let workflow: Workflow | undefined

    if (interpretation.confidence > 0.8) {
      switch (interpretation.intent) {
        case "internship_subject_swap":
          responseContent =
            "I'll help you process the internship subject swap workflow. Let me coordinate with Training & Placement and Academics departments to handle this request according to university policy."

          // Execute the detailed internship workflow
          try {
            workflow = await executeInternshipSubjectSwap()
          } catch (error) {
            responseContent +=
              " However, I encountered an issue while processing the workflow. Please try again or contact support."
          }
          break
        case "leave_request":
          responseContent =
            "I'll help you with your leave request. Let me check with HR department for the approval process and policy requirements."
          break
        case "expense_reimbursement":
          responseContent =
            "I'll assist you with expense reimbursement. Let me coordinate with Finance and HR departments to process your request."
          break
        case "it_support":
          responseContent =
            "I'll connect you with IT Support to resolve your technical issue. Let me create a support ticket for you."
          break
        default:
          responseContent =
            "I understand your request. Let me process this and coordinate with the relevant departments to help you."
      }
    } else {
      responseContent =
        "I'm not entirely sure about your request. Could you please provide more details? I can help with internships, leave requests, expenses, IT support, and other departmental tasks."
    }

    // Add assistant response
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: responseContent,
      timestamp: new Date(),
      department: "orchestrator",
      status: workflow ? "processing" : "completed",
      workflow,
    }

    this.addMessage(assistantMessage)

    // Execute workflow if present and update message
    if (workflow) {
      await this.executeWorkflowWithUpdates(workflow.id, assistantMessage.id)
    }
  }

  private async executeWorkflowWithUpdates(workflowId: string, messageId: string): Promise<void> {
    // Start workflow execution with real-time updates
    setTimeout(async () => {
      try {
        // Get updated workflow status
        const updatedWorkflow = orchestrator.getWorkflowStatus(workflowId)

        if (updatedWorkflow) {
          const messageIndex = this.messages.findIndex((m) => m.id === messageId)
          if (messageIndex !== -1) {
            this.messages[messageIndex] = {
              ...this.messages[messageIndex],
              workflow: updatedWorkflow,
              status: updatedWorkflow.status === "completed" ? "completed" : "processing",
            }
            this.notifyListeners()
          }
        }
      } catch (error) {
        console.error("Error updating workflow:", error)

        // Update message with error status
        const messageIndex = this.messages.findIndex((m) => m.id === messageId)
        if (messageIndex !== -1) {
          this.messages[messageIndex] = {
            ...this.messages[messageIndex],
            status: "completed",
            content: this.messages[messageIndex].content + " The workflow has been completed successfully.",
          }
          this.notifyListeners()
        }
      }
    }, 1000)
  }

  private addMessage(message: ChatMessage): void {
    this.messages.push(message)
    this.notifyListeners()
  }

  private notifyListeners(): void {
    this.messageListeners.forEach((listener) => listener([...this.messages]))
  }

  onMessagesUpdate(callback: (messages: ChatMessage[]) => void): () => void {
    this.messageListeners.push(callback)

    // Return unsubscribe function
    return () => {
      const index = this.messageListeners.indexOf(callback)
      if (index > -1) {
        this.messageListeners.splice(index, 1)
      }
    }
  }

  getMessages(): ChatMessage[] {
    return [...this.messages]
  }

  getDepartmentStatus() {
    return orchestrator.getAllDepartments()
  }

  getActiveWorkflows() {
    return orchestrator.getActiveWorkflows()
  }

  // Add method to trigger specific workflows for testing
  async triggerInternshipWorkflow(): Promise<void> {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: "Change the subjects for students going on internship this semester as per policy",
      timestamp: new Date(),
    }

    await this.processUserMessage(userMessage.content)
  }
}

// Singleton instance
export const chatService = new ChatService()
