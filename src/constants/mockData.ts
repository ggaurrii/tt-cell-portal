import { Student, Project, AttendanceRecord, Announcement } from '@/types';

export const DOMAINS = [
  'AI & Machine Learning',
  'Web Development',
  'Cyber Security',
  'Embedded Systems',
  'IoT',
  'Robotics',
  'Data Science',
];

export const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Arjun Sharma', studentId: 'TTC2025001', email: 'arjun@example.com', phone: '+91 98765 43210', domain: 'AI & Machine Learning', enrollmentDate: '2025-01-15', status: 'active', attendancePercentage: 92, projectsAssigned: 2, projectsCompleted: 1, batch: 'Batch 2025-A' },
  { id: '2', name: 'Priya Patel', studentId: 'TTC2025002', email: 'priya@example.com', phone: '+91 87654 32109', domain: 'Web Development', enrollmentDate: '2025-01-15', status: 'active', attendancePercentage: 88, projectsAssigned: 1, projectsCompleted: 1, batch: 'Batch 2025-A' },
  { id: '3', name: 'Rahul Singh', studentId: 'TTC2025003', email: 'rahul@example.com', phone: '+91 76543 21098', domain: 'Cyber Security', enrollmentDate: '2025-01-15', status: 'active', attendancePercentage: 65, projectsAssigned: 2, projectsCompleted: 0, batch: 'Batch 2025-A' },
  { id: '4', name: 'Anita Verma', studentId: 'TTC2025004', email: 'anita@example.com', phone: '+91 65432 10987', domain: 'IoT', enrollmentDate: '2025-02-01', status: 'active', attendancePercentage: 95, projectsAssigned: 3, projectsCompleted: 2, batch: 'Batch 2025-B' },
  { id: '5', name: 'Kiran Kumar', studentId: 'TTC2025005', email: 'kiran@example.com', phone: '+91 54321 09876', domain: 'Robotics', enrollmentDate: '2025-02-01', status: 'inactive', attendancePercentage: 45, projectsAssigned: 1, projectsCompleted: 0, batch: 'Batch 2025-B' },
  { id: '6', name: 'Deepak Mishra', studentId: 'TTC2025006', email: 'deepak@example.com', phone: '+91 43210 98765', domain: 'Data Science', enrollmentDate: '2025-02-01', status: 'active', attendancePercentage: 78, projectsAssigned: 2, projectsCompleted: 1, batch: 'Batch 2025-B' },
  { id: '7', name: 'Sneha Joshi', studentId: 'TTC2025007', email: 'sneha@example.com', phone: '+91 32109 87654', domain: 'Embedded Systems', enrollmentDate: '2025-03-01', status: 'completed', attendancePercentage: 91, projectsAssigned: 2, projectsCompleted: 2, batch: 'Batch 2025-C' },
  { id: '8', name: 'Amit Gupta', studentId: 'TTC2025008', email: 'amit@example.com', phone: '+91 21098 76543', domain: 'AI & Machine Learning', enrollmentDate: '2025-03-01', status: 'active', attendancePercentage: 84, projectsAssigned: 2, projectsCompleted: 1, batch: 'Batch 2025-C' },
];

export const MOCK_PROJECTS: Project[] = [
  { id: '1', title: 'Smart Agriculture Monitoring System', description: 'IoT-based crop monitoring using sensors and ML', domain: 'IoT', status: 'active', assignedTo: ['1', '4'], startDate: '2025-03-01', deadline: '2025-06-30', progress: 65, priority: 'high', supervisor: 'Lt. Col. Ramesh' },
  { id: '2', title: 'Intrusion Detection System', description: 'Network-based IDS using anomaly detection algorithms', domain: 'Cyber Security', status: 'active', assignedTo: ['3'], startDate: '2025-02-15', deadline: '2025-05-31', progress: 45, priority: 'high', supervisor: 'Maj. Suresh' },
  { id: '3', title: 'Vehicle Tracking Portal', description: 'Web portal for real-time vehicle location tracking', domain: 'Web Development', status: 'completed', assignedTo: ['2', '6'], startDate: '2025-01-20', deadline: '2025-04-30', progress: 100, priority: 'medium', supervisor: 'Capt. Vinod' },
  { id: '4', title: 'Robotic Arm Controller', description: 'Precision robotic arm for assembly operations', domain: 'Robotics', status: 'pending', assignedTo: ['5'], startDate: '2025-04-01', deadline: '2025-07-31', progress: 20, priority: 'medium', supervisor: 'Col. Prakash' },
  { id: '5', title: 'Predictive Maintenance ML Model', description: 'ML model to predict equipment failures before they occur', domain: 'AI & Machine Learning', status: 'active', assignedTo: ['1', '8'], startDate: '2025-03-15', deadline: '2025-06-15', progress: 72, priority: 'high', supervisor: 'Lt. Col. Ramesh' },
  { id: '6', title: 'Embedded Sensor Array', description: 'Custom sensor array with embedded processing unit', domain: 'Embedded Systems', status: 'completed', assignedTo: ['7'], startDate: '2025-01-10', deadline: '2025-03-31', progress: 100, priority: 'low', supervisor: 'Maj. Rajesh' },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'New Batch Registration Open for 2025', content: 'Registrations for the new vocational training batch are now open. Interested candidates can apply through the portal. Last date for registration is 30th July 2025.', category: 'general', priority: 'high', publishedAt: '2025-05-26', isPinned: true, isDraft: false, author: 'Admin' },
  { id: '2', title: 'Workshop on IoT & Embedded Systems', content: 'Hands-on workshop on IoT and Embedded Systems scheduled from 10th June onwards. All students in IoT and Embedded domains must attend.', category: 'event', priority: 'medium', publishedAt: '2025-05-24', isPinned: false, isDraft: false, author: 'Training Dept' },
  { id: '3', title: 'Project Submission Deadline Extended', content: 'Deadline for final project submission has been extended to 5th June 2025 due to the upcoming annual inspection. All students must submit by this date.', category: 'deadline', priority: 'urgent', publishedAt: '2025-05-22', isPinned: true, isDraft: false, author: 'Admin' },
  { id: '4', title: 'Cyber Security Awareness Week', content: 'Special awareness sessions on Cyber Security to be held from 12th June. Attendance mandatory for all students.', category: 'event', priority: 'medium', publishedAt: '2025-05-20', isPinned: false, isDraft: false, author: 'Training Dept' },
  { id: '5', title: 'Annual Technical Exhibition 2025', content: 'Mark your calendars! The Annual Technical Exhibition will be held on 15th August 2025. All project teams must prepare demonstrations.', category: 'event', priority: 'high', publishedAt: '2025-05-18', isPinned: false, isDraft: false, author: 'Admin' },
];

export const MOCK_OPERATIONAL_LOGS = [
  { id: '1', title: 'Student Registered', user: 'Arjun Sharma', module: 'Registration', time: '10 mins ago', status: 'success', icon: 'UserPlus' },
  { id: '2', title: 'Project Approved', user: 'Maj. Suresh', module: 'Projects', time: '1 hour ago', status: 'success', icon: 'CheckCircle' },
  { id: '3', title: 'Weekly Report Generated', user: 'System', module: 'Reports', time: '2 hours ago', status: 'info', icon: 'FileText' },
  { id: '4', title: 'Attendance Uploaded', user: 'Capt. Vinod', module: 'Attendance', time: '3 hours ago', status: 'success', icon: 'Calendar' },
  { id: '5', title: 'Low Attendance Flagged', user: 'Rahul Singh', module: 'Alerts', time: '4 hours ago', status: 'warning', icon: 'AlertTriangle' },
  { id: '6', title: 'Repository Updated', user: 'Anita Verma', module: 'Projects', time: '5 hours ago', status: 'info', icon: 'UploadCloud' },
  { id: '7', title: 'Instructor Assigned', user: 'Lt. Col. Ramesh', module: 'Training', time: 'Yesterday', status: 'success', icon: 'Users' },
  { id: '8', title: 'Batch 2025-C Created', user: 'Admin', module: 'Batches', time: 'Yesterday', status: 'success', icon: 'FolderPlus' },
];

export const MOCK_ALERTS_NOTICES = [
  { id: '1', title: 'Upcoming Assessment', desc: 'Mid-term assessment for Batch A next week.', priority: 'High', icon: 'PenTool' },
  { id: '2', title: 'Submission Deadline', desc: 'IoT project final submissions due in 2 days.', priority: 'High', icon: 'Clock' },
  { id: '3', title: 'Scheduled Maintenance', desc: 'Portal down for maintenance tonight at 2AM.', priority: 'Medium', icon: 'Settings' },
  { id: '4', title: 'New Training Batch', desc: 'Batch D orientations begin next Monday.', priority: 'Low', icon: 'Info' },
  { id: '5', title: 'Instructor Meeting', desc: 'Monthly sync up scheduled for Friday 3 PM.', priority: 'Medium', icon: 'Users' },
];

export const DOMAIN_DISTRIBUTION = [
  { name: 'AI & ML', value: 85, color: '#1B3A2D' },
  { name: 'Web Dev', value: 72, color: '#2D5A3D' },
  { name: 'Cyber Sec', value: 65, color: '#C9A227' },
  { name: 'Embedded', value: 48, color: '#4d954d' },
  { name: 'IoT', value: 90, color: '#7ab57a' },
  { name: 'Robotics', value: 55, color: '#A07D1A' },
  { name: 'Data Sci', value: 78, color: '#E8BB3A' },
];

export const ATTENDANCE_TREND = [
  { name: 'Mon', present: 38, absent: 4, late: 2 },
  { name: 'Tue', present: 40, absent: 2, late: 2 },
  { name: 'Wed', present: 35, absent: 7, late: 2 },
  { name: 'Thu', present: 42, absent: 1, late: 1 },
  { name: 'Fri', present: 36, absent: 5, late: 3 },
  { name: 'Sat', present: 30, absent: 8, late: 2 },
];

export const MONTHLY_ATTENDANCE = [
  { month: 'Jan', percentage: 87 },
  { month: 'Feb', percentage: 82 },
  { month: 'Mar', percentage: 91 },
  { month: 'Apr', percentage: 78 },
  { month: 'May', percentage: 85 },
  { month: 'Jun', percentage: 89 },
];
