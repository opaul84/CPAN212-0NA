import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Resume.css';

const Resume = ({ darkMode }) => {
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [overview, setOverview] = useState('');
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [projects, setProjects] = useState([]);

  // Fetch data from the Express server
  useEffect(() => {
    fetch('http://localhost:8000/getEdu')
      .then(response => response.json())
      .then(data => setEducation(data))
      .catch(err => console.error('Error fetching education data:', err));

    fetch('http://localhost:8000/getExp')
      .then(response => response.json())
      .then(data => setExperience(data))
      .catch(err => console.error('Error fetching experience data:', err));

    fetch('http://localhost:8000/getOverview')
      .then(response => response.json())
      .then(data => setOverview(data.summary))
      .catch(err => console.error('Error fetching overview data:', err));

    fetch('http://localhost:8000/getSkills')
      .then(response => response.json())
      .then(data => setSkills(data))
      .catch(err => console.error('Error fetching skills data:', err));

    fetch('http://localhost:8000/getCertifications')
      .then(response => response.json())
      .then(data => setCertifications(data))
      .catch(err => console.error('Error fetching certifications data:', err));

    fetch('http://localhost:8000/getProjects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(err => console.error('Error fetching projects data:', err));
  }, []);

  const [contactInfo, setContactInfo] = useState({
    email: 'opaul1984@gmail.com',
    phone: '(416) 567-1715',
    linkedin: 'www.linkedin.com/in/o-shaine-paul-ba91b020b',
  });

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <Container className="resume-container">
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="p-4 header-card">
            <Card.Body>
              <h1 className="text-center">O'Shaine Paul</h1>
              <p className="overview">{overview || 'Loading overview...'}</p>
            </Card.Body>
          </Card>
        </motion.div>

        <Row>
          <Col md={6}>
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card className="p-3 section-card">
                <Card.Body>
                  <h2>Education</h2>
                  <ul>
                    {education.length > 0 ? (
                      education.map((edu, idx) => (
                        <li key={idx}>{edu.degree} - {edu.school} ({edu.year})</li>
                      ))
                    ) : (
                      <li>Loading education data...</li>
                    )}
                  </ul>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col md={6}>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Card className="p-3 section-card">
                <Card.Body>
                  <h2>Experience</h2>
                  <ul>
                    {experience.length > 0 ? (
                      experience.map((exp, idx) => (
                        <li key={idx}>
                          <strong>{exp.position} at {exp.company} ({exp.years})</strong><br />
                          {exp.description}
                        </li>
                      ))
                    ) : (
                      <li>Loading experience data...</li>
                    )}
                  </ul>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="p-3 section-card mt-4">
            <Card.Body>
              <h2>Skills</h2>
              <ul className="skills-list">
                {skills.length > 0 ? (
                  skills.map((skill, idx) => <li key={idx} className="skill-item">{skill}</li>)
                ) : (
                  <li>Loading skills data...</li>
                )}
              </ul>
            </Card.Body>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="p-3 section-card mt-4">
            <Card.Body>
              <h2>Certifications</h2>
              <ul>
                {certifications.length > 0 ? (
                  certifications.map((cert, idx) => (
                    <li key={idx}>
                      <strong>{cert.title}</strong> - {cert.institution} ({cert.year})
                    </li>
                  ))
                ) : (
                  <li>Loading certifications data...</li>
                )}
              </ul>
            </Card.Body>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="p-3 section-card mt-4">
            <Card.Body>
              <h2>Projects</h2>
              <ul>
                {projects.length > 0 ? (
                  projects.map((project, idx) => (
                    <li key={idx}>
                      <strong>{project.title}</strong><br />
                      {project.description}
                    </li>
                  ))
                ) : (
                  <li>Loading projects data...</li>
                )}
              </ul>
            </Card.Body>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="p-3 section-card mt-4">
            <Card.Body>
              <h2>Contact</h2>
              <ul>
                <li>Email: {contactInfo.email}</li>
                <li>Phone: {contactInfo.phone}</li>
                <li>LinkedIn: {contactInfo.linkedin}</li>
              </ul>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default Resume;
