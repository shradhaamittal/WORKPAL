// Database connection and query utilities for WorkPal
// Simulates database operations for the frontend demo

export interface DatabaseConnection {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>
  queryOne<T = any>(sql: string, params?: any[]): Promise<T | null>
  execute(sql: string, params?: any[]): Promise<{ affectedRows: number }>
}

// Mock database implementation for demo purposes
class MockDatabase implements DatabaseConnection {
  private data: Map<string, any[]> = new Map()

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Initialize with sample data that matches our SQL schema
    this.data.set("students", [
      {
        id: "S001",
        name: "John Doe",
        email: "john.doe@student.edu",
        program: "Computer Science Engineering",
        semester: 6,
        cgpa: 8.5,
        completed_credits: 140,
        backlogs: 0,
        status: "active",
      },
      {
        id: "S002",
        name: "Jane Smith",
        email: "jane.smith@student.edu",
        program: "Computer Science Engineering",
        semester: 6,
        cgpa: 7.8,
        completed_credits: 138,
        backlogs: 1,
        status: "active",
      },
      {
        id: "S003",
        name: "Mike Johnson",
        email: "mike.johnson@student.edu",
        program: "Computer Science Engineering",
        semester: 6,
        cgpa: 8.2,
        completed_credits: 142,
        backlogs: 0,
        status: "active",
      },
    ])

    this.data.set("employees", [
      {
        id: "EMP001",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        department: "CSE",
        position: "Department Head",
        join_date: "2020-01-15",
        status: "active",
      },
      {
        id: "EMP003",
        name: "Ms. Lisa Wilson",
        email: "lisa.wilson@university.edu",
        department: "HR",
        position: "HR Manager",
        join_date: "2021-03-10",
        status: "active",
      },
    ])

    this.data.set("companies", [
      {
        id: "COMP001",
        name: "TechCorp Solutions",
        industry: "Information Technology",
        tier: "tier1",
        relationship: "premium",
        contact_person: "Sarah Wilson",
        contact_email: "sarah.wilson@techcorp.com",
      },
      {
        id: "COMP002",
        name: "InnovateLab",
        industry: "Software Development",
        tier: "tier1",
        relationship: "premium",
        contact_person: "John Martinez",
        contact_email: "john.martinez@innovatelab.com",
      },
    ])

    this.data.set("internships", [
      {
        id: 1,
        student_id: "S001",
        company_id: "COMP001",
        start_date: "2024-06-01",
        end_date: "2024-08-24",
        duration_weeks: 12,
        stipend: 25000.0,
        status: "confirmed",
        offer_received: false,
      },
      {
        id: 2,
        student_id: "S002",
        company_id: "COMP002",
        start_date: "2024-06-15",
        end_date: "2024-08-31",
        duration_weeks: 10,
        stipend: 20000.0,
        status: "confirmed",
        offer_received: false,
      },
    ])

    this.data.set("subjects", [
      {
        code: "CS501",
        name: "Departmental Elective-2",
        credits: 3,
        department: "CSE",
        semester: 5,
        type: "elective",
      },
      {
        code: "CS502",
        name: "Open Elective",
        credits: 2,
        department: "CSE",
        semester: 5,
        type: "elective",
      },
      {
        code: "CS401",
        name: "Mobile Applications",
        credits: 3,
        department: "CSE",
        semester: 4,
        type: "elective",
      },
      {
        code: "CS601",
        name: "Project Report",
        credits: 4,
        department: "CSE",
        semester: 6,
        type: "project",
      },
    ])

    this.data.set("workflows", [])
    this.data.set("workflow_steps", [])
    this.data.set("policies", [
      {
        id: 1,
        name: "Internship Subject Swap Policy",
        department: "academics",
        type: "subject_management",
        rules: {
          substitutions: {
            "Departmental Elective-2": "Mobile Applications",
            "Open Elective": "Project Report",
          },
          eligibility: {
            minCGPA: 6.5,
            completedCredits: 120,
          },
        },
        description: "Policy for subject substitution during internship semester",
        effective_date: "2024-01-01",
        status: "active",
      },
    ])
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    // Simple SQL parsing for demo purposes
    const lowerSql = sql.toLowerCase().trim()

    if (lowerSql.startsWith("select")) {
      return this.handleSelect<T>(sql, params)
    } else if (lowerSql.startsWith("insert")) {
      return this.handleInsert<T>(sql, params)
    } else if (lowerSql.startsWith("update")) {
      return this.handleUpdate<T>(sql, params)
    } else if (lowerSql.startsWith("delete")) {
      return this.handleDelete<T>(sql, params)
    }

    return []
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    const results = await this.query<T>(sql, params)
    return results.length > 0 ? results[0] : null
  }

  async execute(sql: string, params?: any[]): Promise<{ affectedRows: number }> {
    const results = await this.query(sql, params)
    return { affectedRows: results.length }
  }

  private handleSelect<T>(sql: string, params?: any[]): T[] {
    // Extract table name from SQL
    const tableMatch = sql.match(/from\s+(\w+)/i)
    if (!tableMatch) return []

    const tableName = tableMatch[1]
    const tableData = this.data.get(tableName) || []

    // Simple filtering based on WHERE clauses
    if (sql.includes("WHERE") || sql.includes("where")) {
      return this.applyWhereClause(tableData, sql, params) as T[]
    }

    return tableData as T[]
  }

  private handleInsert<T>(sql: string, params?: any[]): T[] {
    const tableMatch = sql.match(/into\s+(\w+)/i)
    if (!tableMatch) return []

    const tableName = tableMatch[1]
    const tableData = this.data.get(tableName) || []

    // For demo purposes, create a mock record
    const newRecord = this.createMockRecord(tableName, params)
    if (newRecord) {
      tableData.push(newRecord)
      this.data.set(tableName, tableData)
    }

    return [newRecord] as T[]
  }

  private handleUpdate<T>(sql: string, params?: any[]): T[] {
    // Mock update operation
    return [] as T[]
  }

  private handleDelete<T>(sql: string, params?: any[]): T[] {
    // Mock delete operation
    return [] as T[]
  }

  private applyWhereClause(data: any[], sql: string, params?: any[]): any[] {
    // Simple WHERE clause handling for demo
    if (sql.includes("student_id")) {
      const studentId = params?.[0] || "S001"
      return data.filter((item) => item.student_id === studentId || item.id === studentId)
    }

    if (sql.includes("status")) {
      const status = params?.[0] || "active"
      return data.filter((item) => item.status === status)
    }

    return data
  }

  private createMockRecord(tableName: string, params?: any[]): any {
    const timestamp = new Date().toISOString()

    switch (tableName) {
      case "workflows":
        return {
          id: `WF_${Date.now()}`,
          name: "New Workflow",
          type: "general",
          status: "pending",
          initiated_by: "system",
          created_at: timestamp,
          data: {},
        }
      case "workflow_steps":
        return {
          id: Date.now(),
          workflow_id: params?.[0] || "WF_001",
          step_order: 1,
          department: "admin",
          action: "Process request",
          status: "pending",
          created_at: timestamp,
        }
      default:
        return {
          id: Date.now(),
          created_at: timestamp,
        }
    }
  }
}

// Database service class
export class DatabaseService {
  private db: DatabaseConnection

  constructor() {
    // In a real application, this would connect to PostgreSQL/MongoDB
    this.db = new MockDatabase()
  }

  // Student operations
  async getStudentById(studentId: string) {
    return this.db.queryOne("SELECT * FROM students WHERE id = ?", [studentId])
  }

  async getStudentsByStatus(status = "active") {
    return this.db.query("SELECT * FROM students WHERE status = ?", [status])
  }

  async getInternshipStudents() {
    return this.db.query(`
      SELECT s.*, i.company_id, i.start_date, i.duration_weeks, c.name as company_name
      FROM students s
      JOIN internships i ON s.id = i.student_id
      JOIN companies c ON i.company_id = c.id
      WHERE i.status = 'confirmed'
    `)
  }

  // Employee operations
  async getEmployeeById(employeeId: string) {
    return this.db.queryOne("SELECT * FROM employees WHERE id = ?", [employeeId])
  }

  // Company operations
  async getCompanyById(companyId: string) {
    return this.db.queryOne("SELECT * FROM companies WHERE id = ?", [companyId])
  }

  async getAllCompanies() {
    return this.db.query("SELECT * FROM companies WHERE status = ?", ["active"])
  }

  // Subject operations
  async getSubjectByCode(subjectCode: string) {
    return this.db.queryOne("SELECT * FROM subjects WHERE code = ?", [subjectCode])
  }

  async getSubjectsByDepartment(department: string) {
    return this.db.query("SELECT * FROM subjects WHERE department = ?", [department])
  }

  // Workflow operations
  async createWorkflow(workflowData: any) {
    const sql = `
      INSERT INTO workflows (id, name, description, type, status, initiated_by, data)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    return this.db.execute(sql, [
      workflowData.id,
      workflowData.name,
      workflowData.description,
      workflowData.type,
      workflowData.status,
      workflowData.initiated_by,
      JSON.stringify(workflowData.data),
    ])
  }

  async updateWorkflowStatus(workflowId: string, status: string) {
    const sql = "UPDATE workflows SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    return this.db.execute(sql, [status, workflowId])
  }

  async createWorkflowStep(stepData: any) {
    const sql = `
      INSERT INTO workflow_steps (workflow_id, step_order, department, action, status, data)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    return this.db.execute(sql, [
      stepData.workflow_id,
      stepData.step_order,
      stepData.department,
      stepData.action,
      stepData.status,
      JSON.stringify(stepData.data),
    ])
  }

  async updateWorkflowStep(stepId: number, status: string, data?: any) {
    const sql = `
      UPDATE workflow_steps 
      SET status = ?, data = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `
    return this.db.execute(sql, [status, JSON.stringify(data), stepId])
  }

  // Policy operations
  async getPolicyByName(name: string, department: string) {
    return this.db.queryOne("SELECT * FROM policies WHERE name = ? AND department = ? AND status = ?", [
      name,
      department,
      "active",
    ])
  }

  async getPoliciesByDepartment(department: string) {
    return this.db.query("SELECT * FROM policies WHERE department = ? AND status = ?", [department, "active"])
  }

  // Leave request operations
  async createLeaveRequest(leaveData: any) {
    const sql = `
      INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, days_requested, reason, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    return this.db.execute(sql, [
      leaveData.employee_id,
      leaveData.leave_type,
      leaveData.start_date,
      leaveData.end_date,
      leaveData.days_requested,
      leaveData.reason,
      leaveData.status || "pending",
    ])
  }

  // Analytics and reporting
  async getWorkflowStats() {
    return {
      total: 156,
      completed: 142,
      processing: 8,
      pending: 6,
      failed: 0,
    }
  }

  async getDepartmentStats() {
    return {
      hr: { active_requests: 12, avg_response_time: "2.3 hours" },
      academics: { active_requests: 8, avg_response_time: "1.8 hours" },
      tnp: { active_requests: 15, avg_response_time: "3.1 hours" },
      finance: { active_requests: 5, avg_response_time: "4.2 hours" },
      it: { active_requests: 3, avg_response_time: "1.5 hours" },
    }
  }
}

// Singleton instance
export const dbService = new DatabaseService()
