import type { PortfolioData } from '@/lib/portfolio-data';

function formatDescription(desc: string): string {
  if (!desc) return '';
  const lines = desc.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length <= 1) {
    return `<p class="entry-desc">${desc}</p>`;
  }
  return `<ul class="bullets">${lines.map(line => `<li>${line.replace(/^[•·\-\*\s]+/, '')}</li>`).join('')}</ul>`;
}

export function generateResumeHTML(data: PortfolioData): string {
  const { profile, about, skills, projects, education, experience, certificates, achievements } = data;

  const contactParts = [];
  if (profile.email) contactParts.push(profile.email);
  if (profile.phone) contactParts.push(profile.phone);
  if (profile.location) contactParts.push(profile.location);
  if (profile.website) contactParts.push(profile.website);
  if (profile.github) contactParts.push(profile.github);
  if (profile.linkedin) contactParts.push(profile.linkedin);
  const contactLine = contactParts.join('  |  ');

  const skillsHTML = skills.length > 0
    ? `<section class="section">
        <h2>Technical Skills</h2>
        <p class="skills-list">${skills.join(', ')}</p>
      </section>`
    : '';

  const experienceHTML = experience.length > 0
    ? `<section class="section">
        <h2>Professional Experience</h2>
        ${experience.map(e => `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title"><strong>${e.role}</strong></span>
            <span class="entry-date">${e.start} – ${e.end}</span>
          </div>
          <div class="entry-sub-header">
            <span class="entry-subtitle">${e.company}</span>
          </div>
          ${formatDescription(e.description)}
        </div>`).join('')}
      </section>`
    : '';

  const projectsHTML = projects.length > 0
    ? `<section class="section">
        <h2>Projects</h2>
        ${projects.map(p => `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title"><strong>${p.title}</strong></span>
            <span class="entry-date">${p.live || ''}</span>
          </div>
          ${p.github ? `<div class="entry-sub-header"><span class="entry-subtitle">${p.github}</span></div>` : ''}
          ${formatDescription(p.description)}
          ${p.tech.length > 0 ? `<p class="tech-stack"><strong>Technologies:</strong> ${p.tech.join(', ')}</p>` : ''}
        </div>`).join('')}
      </section>`
    : '';

  const educationHTML = education.length > 0
    ? `<section class="section">
        <h2>Education</h2>
        ${education.map(e => `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title"><strong>${e.degree} in ${e.field}</strong></span>
            <span class="entry-date">${e.start} – ${e.end}</span>
          </div>
          <div class="entry-sub-header">
            <span class="entry-subtitle">${e.institution}</span>
          </div>
          ${formatDescription(e.description)}
        </div>`).join('')}
      </section>`
    : '';

  const certsHTML = certificates.length > 0
    ? `<section class="section">
        <h2>Certifications</h2>
        ${certificates.map(c => `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title"><strong>${c.title}</strong></span>
            <span class="entry-date">${c.date}</span>
          </div>
          <div class="entry-sub-header">
            <span class="entry-subtitle">${c.issuer}</span>
          </div>
        </div>`).join('')}
      </section>`
    : '';

  const achievementsHTML = achievements.length > 0
    ? `<section class="section">
        <h2>Achievements</h2>
        ${achievements.map(a => `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title"><strong>${a.title}</strong></span>
            <span class="entry-date">${a.date}</span>
          </div>
          ${formatDescription(a.description)}
        </div>`).join('')}
      </section>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${profile.fullName} — Resume</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Arial', 'Helvetica', sans-serif;
    line-height: 1.5;
    color: #000000;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
    background-color: #ffffff;
  }
  
  .header {
    text-align: center;
    margin-bottom: 24px;
  }
  
  h1 {
    font-size: 26px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 4px;
    letter-spacing: 0.5px;
  }
  
  .title-sub {
    font-size: 15px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 6px;
  }
  
  .contact-info {
    font-size: 12px;
    color: #444444;
    word-wrap: break-word;
  }
  
  .section {
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    border-bottom: 1px solid #000000;
    padding-bottom: 3px;
    margin-bottom: 10px;
  }
  
  .summary {
    font-size: 13px;
    color: #111111;
    margin-bottom: 10px;
    text-align: justify;
  }
  
  .entry {
    margin-bottom: 12px;
  }
  
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  
  .entry-title {
    font-size: 13px;
    color: #000000;
  }
  
  .entry-date {
    font-size: 12px;
    color: #000000;
    font-weight: 600;
  }
  
  .entry-sub-header {
    margin-top: 1px;
    margin-bottom: 4px;
  }
  
  .entry-subtitle {
    font-size: 12.5px;
    font-style: italic;
    color: #333333;
  }
  
  .entry-desc {
    font-size: 13px;
    color: #111111;
    margin-top: 2px;
    text-align: justify;
  }
  
  .bullets {
    margin-left: 18px;
    margin-top: 3px;
  }
  
  .bullets li {
    font-size: 13px;
    color: #111111;
    margin-bottom: 2px;
    text-align: justify;
  }
  
  .tech-stack {
    font-size: 12px;
    color: #222222;
    margin-top: 4px;
  }
  
  .skills-list {
    font-size: 13px;
    color: #111111;
    line-height: 1.5;
  }
  
  @media print {
    body {
      padding: 0;
      margin: 0;
    }
  }
</style>
</head>
<body>
  <div class="header">
    <h1>${profile.fullName}</h1>
    ${profile.jobTitle ? `<div class="title-sub">${profile.jobTitle}</div>` : ''}
    <div class="contact-info">${contactLine}</div>
  </div>
  
  ${about ? `<section class="section"><h2>Professional Summary</h2><p class="summary">${about}</p></section>` : ''}
  ${skillsHTML}
  ${experienceHTML}
  ${projectsHTML}
  ${educationHTML}
  ${certsHTML}
  ${achievementsHTML}
</body>
</html>`;
}
