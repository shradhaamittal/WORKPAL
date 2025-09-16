-- Sample data for WorkPal database
-- Insert test data for students, employees, companies, and other entities

-- Insert sample departments
INSERT INTO departments (id, name, description) VALUES
('CSE', 'Computer Science Engineering', 'Department of Computer Science and Engineering'),
('ECE', 'Electronics & Communication', 'Department of Electronics and Communication Engineering'),
('ME', 'Mechanical Engineering', 'Department of Mechanical Engineering'),
('HR', 'Human Resources', 'Human Resources Department'),
('FIN', 'Finance', 'Finance Department'),
('TnP', 'Training & Placement', 'Training and Placement Cell');

-- Insert sample employees
INSERT INTO employees (id, name, email, department, position, join_date) VALUES
('EMP001', 'Dr. Sarah Johnson', 'sarah.johnson@university.edu', 'CSE', 'Department Head', '2020-01-15'),
('EMP002', 'Prof. Michael Chen', 'michael.chen@university.edu', 'CSE', 'Professor', '2019-08-01'),
('EMP003', 'Ms. Lisa Wilson', 'lisa.wilson@university.edu', 'HR', 'HR Manager', '2021-03-10'),
('EMP004', 'Mr. David Brown', 'david.brown@university.edu', 'TnP', 'Placement Officer', '2020-07-20'),
('EMP005', 'Ms. Emily Davis', 'emily.davis@university.edu', 'FIN', 'Finance Manager', '2019-11-05');

-- Insert sample companies
INSERT INTO companies (id, name, industry, tier, relationship, contact_person, contact_email) VALUES
('COMP001', 'TechCorp Solutions', 'Information Technology', 'tier1', 'premium', 'Sarah Wilson', 'sarah.wilson@techcorp.com'),
('COMP002', 'InnovateLab', 'Software Development', 'tier1', 'premium', 'John Martinez', 'john.martinez@innovatelab.com'),
('COMP003', 'DataSys Analytics', 'Data Science', 'tier2', 'partner', 'Rachel Green', 'rachel.green@datasys.com'),
('COMP004', 'CloudTech Services', 'Cloud Computing', 'tier2', 'partner', 'Mark Thompson', 'mark.thompson@cloudtech.com'),
('COMP005', 'AI Solutions Inc', 'Artificial Intelligence', 'tier1', 'premium', 'Jennifer Lee', 'jennifer.lee@aisolutions.com');

-- Insert sample subjects
INSERT INTO subjects (code, name, credits, department, semester, type) VALUES
('CS301', 'Data Structures and Algorithms', 4, 'CSE', 3, 'core'),
('CS302', 'Database Management Systems', 3, 'CSE', 3, 'core'),
('CS303', 'Computer Networks', 3, 'CSE', 4, 'core'),
('CS401', 'Mobile Application Development', 3, 'CSE', 4, 'elective'),
('CS402', 'Machine Learning', 4, 'CSE', 5, 'elective'),
('CS501', 'Departmental Elective-2', 3, 'CSE', 5, 'elective'),
('CS502', 'Open Elective', 2, 'CSE', 5, 'elective'),
('CS601', 'Project Report', 4, 'CSE', 6, 'project'),
('CS602', 'Industry Internship', 6, 'CSE', 6, 'internship');

-- Insert sample students
INSERT INTO students (id, name, email, program, semester, cgpa, completed_credits, backlogs) VALUES
('S001', 'John Doe', 'john.doe@student.edu', 'Computer Science Engineering', 6, 8.5, 140, 0),
('S002', 'Jane Smith', 'jane.smith@student.edu', 'Computer Science Engineering', 6, 7.8, 138, 1),
('S003', 'Mike Johnson', 'mike.johnson@student.edu', 'Computer Science Engineering', 6, 8.2, 142, 0),
('S004', 'Alice Brown', 'alice.brown@student.edu', 'Computer Science Engineering', 5, 7.9, 120, 0),
('S005', 'Bob Wilson', 'bob.wilson@student.edu', 'Computer Science Engineering', 5, 8.7, 125, 0),
('S006', 'Carol Davis', 'carol.davis@student.edu', 'Computer Science Engineering', 4, 7.5, 95, 2),
('S007', 'David Lee', 'david.lee@student.edu', 'Computer Science Engineering', 4, 8.1, 98, 0),
('S008', 'Emma Garcia', 'emma.garcia@student.edu', 'Computer Science Engineering', 6, 8.9, 145, 0);

-- Insert sample student subjects (current semester enrollments)
INSERT INTO student_subjects (student_id, subject_code, semester, status) VALUES
-- Semester 6 students (internship semester)
('S001', 'CS601', 6, 'enrolled'),
('S001', 'CS602', 6, 'enrolled'),
('S002', 'CS601', 6, 'enrolled'),
('S002', 'CS602', 6, 'enrolled'),
('S003', 'CS601', 6, 'enrolled'),
('S003', 'CS602', 6, 'enrolled'),
('S008', 'CS601', 6, 'enrolled'),
('S008', 'CS602', 6, 'enrolled'),

-- Semester 5 students
('S004', 'CS402', 5, 'enrolled'),
('S004', 'CS501', 5, 'enrolled'),
('S004', 'CS502', 5, 'enrolled'),
('S005', 'CS402', 5, 'enrolled'),
('S005', 'CS501', 5, 'enrolled'),
('S005', 'CS502', 5, 'enrolled'),

-- Semester 4 students
('S006', 'CS303', 4, 'enrolled'),
('S006', 'CS401', 4, 'enrolled'),
('S007', 'CS303', 4, 'enrolled'),
('S007', 'CS401', 4, 'enrolled');

-- Insert sample internships
INSERT INTO internships (student_id, company_id, start_date, end_date, duration_weeks, stipend, status, performance_rating, offer_received) VALUES
('S001', 'COMP001', '2024-06-01', '2024-08-24', 12, 25000.00, 'confirmed', NULL, FALSE),
('S002', 'COMP002', '2024-06-15', '2024-08-31', 10, 20000.00, 'confirmed', NULL, FALSE),
('S003', 'COMP003', '2024-07-01', '2024-08-26', 8, 18000.00, 'confirmed', NULL, FALSE),
('S008', 'COMP001', '2024-06-01', '2024-08-24', 12, 25000.00, 'completed', 'Excellent', TRUE);

-- Insert sample placements
INSERT INTO placements (student_id, company_id, job_role, package_amount, offer_date, status) VALUES
('S008', 'COMP001', 'Software Engineer', 1200000.00, '2024-08-15', 'accepted');

-- Insert sample leave requests
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, days_requested, reason, status) VALUES
('EMP003', 'annual', '2024-12-20', '2024-12-31', 10, 'Year-end vacation', 'approved'),
('EMP004', 'sick', '2024-11-15', '2024-11-17', 3, 'Medical treatment', 'pending'),
('EMP005', 'annual', '2024-11-25', '2024-11-29', 5, 'Family function', 'pending');

-- Insert sample policies
INSERT INTO policies (name, department, type, rules, description, effective_date, created_by) VALUES
('Internship Subject Swap Policy', 'academics', 'subject_management', 
 '{"substitutions": {"Departmental Elective-2": "Mobile Applications", "Open Elective": "Project Report"}, "eligibility": {"minCGPA": 6.5, "completedCredits": 120}}',
 'Policy for subject substitution during internship semester', '2024-01-01', 'EMP001'),

('Leave Approval Policy', 'hr', 'leave_management',
 '{"maxConsecutiveDays": 30, "requiresManagerApproval": true, "minimumNotice": 7, "blackoutPeriods": ["2024-12-15:2024-12-31"]}',
 'Employee leave request and approval guidelines', '2024-01-01', 'EMP003'),

('Placement Eligibility Policy', 'tnp', 'placement_management',
 '{"eligibility": {"minCGPA": 7.0, "maxBacklogs": 0, "finalYear": true}, "multipleOffers": {"allowed": true, "maxOffers": 2}}',
 'Student eligibility criteria for campus placements', '2024-01-01', 'EMP004');

-- Insert sample workflows (for demonstration)
INSERT INTO workflows (id, name, description, type, status, initiated_by, data) VALUES
('WF_INTERN_001', 'Internship Subject Swap - Batch 2024', 'Process subject changes for students going on internship', 'internship_swap', 'completed', 'EMP004',
 '{"affectedStudents": ["S001", "S002", "S003"], "semester": 6, "academicYear": "2024-25"}'),

('WF_LEAVE_001', 'Annual Leave Request - Lisa Wilson', 'Process annual leave request for HR Manager', 'leave_request', 'pending', 'EMP003',
 '{"leaveType": "annual", "startDate": "2024-12-20", "endDate": "2024-12-31", "days": 10}');

-- Insert sample workflow steps
INSERT INTO workflow_steps (workflow_id, step_order, department, action, status, data, completed_at) VALUES
('WF_INTERN_001', 1, 'tnp', 'Identify students going on internship', 'completed', '{"studentsFound": 3}', '2024-05-15 10:30:00'),
('WF_INTERN_001', 2, 'academics', 'Apply subject swap policy rules', 'completed', '{"rulesApplied": true}', '2024-05-15 11:15:00'),
('WF_INTERN_001', 3, 'admin', 'Request approval for subject changes', 'completed', '{"approvedBy": "EMP001"}', '2024-05-15 14:20:00'),
('WF_INTERN_001', 4, 'academics', 'Update student database with new subjects', 'completed', '{"recordsUpdated": 3}', '2024-05-15 15:45:00'),

('WF_LEAVE_001', 1, 'hr', 'Validate leave request against policy', 'pending', NULL, NULL),
('WF_LEAVE_001', 2, 'hr', 'Get manager approval', 'pending', NULL, NULL),
('WF_LEAVE_001', 3, 'hr', 'Update leave balance and calendar', 'pending', NULL, NULL);
