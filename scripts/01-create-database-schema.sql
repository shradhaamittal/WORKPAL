-- WorkPal Database Schema
-- Creates tables for students, employees, departments, workflows, and policies

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    program VARCHAR(100) NOT NULL,
    semester INTEGER NOT NULL,
    cgpa DECIMAL(3,2),
    completed_credits INTEGER DEFAULT 0,
    backlogs INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    manager_id VARCHAR(20),
    join_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    head_id VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (head_id) REFERENCES employees(id)
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    credits INTEGER NOT NULL,
    department VARCHAR(50) NOT NULL,
    semester INTEGER NOT NULL,
    type VARCHAR(30) NOT NULL, -- core, elective, lab, project
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student subjects mapping
CREATE TABLE IF NOT EXISTS student_subjects (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    subject_code VARCHAR(20) NOT NULL,
    semester INTEGER NOT NULL,
    grade VARCHAR(5),
    status VARCHAR(20) DEFAULT 'enrolled', -- enrolled, completed, dropped
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (subject_code) REFERENCES subjects(code),
    UNIQUE(student_id, subject_code, semester)
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    industry VARCHAR(50),
    tier VARCHAR(10), -- tier1, tier2, tier3
    relationship VARCHAR(30) DEFAULT 'partner', -- partner, premium, basic
    contact_person VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Internships table
CREATE TABLE IF NOT EXISTS internships (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    company_id VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_weeks INTEGER NOT NULL,
    stipend DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'confirmed', -- applied, confirmed, completed, cancelled
    performance_rating VARCHAR(20),
    offer_received BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Placements table
CREATE TABLE IF NOT EXISTS placements (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    company_id VARCHAR(20) NOT NULL,
    job_role VARCHAR(100) NOT NULL,
    package_amount DECIMAL(12,2) NOT NULL,
    offer_date DATE NOT NULL,
    joining_date DATE,
    status VARCHAR(20) DEFAULT 'offered', -- offered, accepted, rejected, joined
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Leave requests table
CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    leave_type VARCHAR(30) NOT NULL, -- annual, sick, maternity, paternity, emergency
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, cancelled
    approved_by VARCHAR(20),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (approved_by) REFERENCES employees(id)
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- internship_swap, leave_request, expense_claim, etc.
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    initiated_by VARCHAR(20) NOT NULL,
    data JSONB, -- Store workflow-specific data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Workflow steps table
CREATE TABLE IF NOT EXISTS workflow_steps (
    id SERIAL PRIMARY KEY,
    workflow_id VARCHAR(50) NOT NULL,
    step_order INTEGER NOT NULL,
    department VARCHAR(50) NOT NULL,
    action VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    assigned_to VARCHAR(20),
    data JSONB,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id),
    UNIQUE(workflow_id, step_order)
);

-- Policies table
CREATE TABLE IF NOT EXISTS policies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    rules JSONB NOT NULL,
    description TEXT,
    effective_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_by VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    message_type VARCHAR(20) NOT NULL, -- user, assistant, system
    content TEXT NOT NULL,
    department VARCHAR(50),
    workflow_id VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_semester ON students(semester);
CREATE INDEX IF NOT EXISTS idx_students_cgpa ON students(cgpa);
CREATE INDEX IF NOT EXISTS idx_student_subjects_student ON student_subjects(student_id);
CREATE INDEX IF NOT EXISTS idx_internships_student ON internships(student_id);
CREATE INDEX IF NOT EXISTS idx_internships_company ON internships(company_id);
CREATE INDEX IF NOT EXISTS idx_placements_student ON placements(student_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow ON workflow_steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id);
