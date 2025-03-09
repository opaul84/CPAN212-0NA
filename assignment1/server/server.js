const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());

// Sample Data
const education = [
  { school: 'Humber College', degree: 'Computer Programming', year: 'May 2024 – September 2025' },
  { school: 'Durham College', degree: 'Business Administration – Business Marketing', year: '2003–2004' },
  { school: 'Agincourt Collegiate Institute', degree: 'Secondary Diploma, O.S.S.D Achieved', year: '2003' },
];

const experience = [
  { company: 'Bell Technical Solutions', position: 'Technician Trainer Coordinator', years: '2019 – 2024', description: 'Coordinated training and development for Ontario, managed 18 SMEs, worked on VR Learning, Fiber Optic Repair, and Arrow Hub Project.' },
  { company: 'Bell Technical Solutions', position: 'Field Technician/Technician Trainer', years: '2016 – 2019' },
  { company: 'Saints Communications', position: 'Customer Service Manager', years: '2014 – 2016' },
  { company: 'Scotiabank Call Center', position: 'Customer Service (Part-time)', years: '2014 – 2015' },
  { company: 'Gemma Communications', position: 'Consumer Inside Sales', years: '2011 – 2014' },
];

const overview = { summary: 'Experienced communication techniction/facilitaor and  professional manager seeking to fill a senior management role. Passionate about tech, with a strong background in training, development, and project coordination.' };

// Skills and Certifications Data
const skills = [
  'Customer Service', 'Team Leadership', 'Technical Knowledge', 'Financial Planning & Analysis',
  'Verbal & Written Communication', 'Business Support Principles', 'Microsoft Office',
  'Python', 'Java', 'SQL', 'JavaScript', 'React', 'HTML/CSS', 'Problem Solving', 'Software Development Principles',
  'Training & Development', 'Team Management', 'Project Coordination', 'Logistics Management', 'Fibre Optic', 'Copper Communicatoin Frequency'
];

const certifications = [
  { title: 'Certified Field Technician Trainer', institution: 'Bell Technical Solutions', year: '2018' },
  { title: 'Certifited Fiber Optic Technician', institution: 'Bell/Onatrio College', year: '2017' },
  { title: 'Leadership Training Program', institution: 'Bell Technical Solutions', year: '2020' }
];

// Projects Data (New Section)
const projects = [
  { title: 'Arrow Hub Project', description: 'Developed and coordinated a logistical project to efficiently deliver equipment to classes during the pandemic. Awarded Platinum Merit Award in 2021.' },
  { title: 'VR Learning Project', description: 'Coordinated the implementation of VR-based learning to enhance training for technicians in fiber optic repair and other technical areas.' },
  { title: 'Fiber Optic Repair(B3) Field Testing and Training', description: 'Coordinated and managed field testing and launch of Bells Fibre Optic repair units, Also made company wide intructional video still in use today' }
];

// Endpoints
app.get('/getEdu', (req, res) => res.json(education));
app.get('/getExp', (req, res) => res.json(experience));
app.get('/getOverview', (req, res) => res.json(overview));
app.get('/getSkills', (req, res) => res.json(skills));
app.get('/getCertifications', (req, res) => res.json(certifications));
app.get('/getProjects', (req, res) => res.json(projects));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
