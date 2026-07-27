import { IResumeTemplate } from './template.interface';

export class ModernTemplate implements IResumeTemplate {
  draw(doc: any, data: any): void {
    const margin = 50;
    doc.page.margins = { top: margin, bottom: margin, left: margin, right: margin };

    const themeColor = data.theme?.primaryColor || '#3B82F6'; // Default primary color
    const accentColor = data.theme?.accentColor || '#10B981';

    const name = data.profile?.fullName || data.user?.name || 'Your Name';
    const title = data.profile?.title || 'Professional Title';
    const bio = data.about?.text || data.profile?.bio || '';

    // Draw header box
    const headerHeight = 90;
    doc.rect(0, 0, doc.page.width, headerHeight + 20)
       .fill(themeColor);

    // Header Content
    doc.fillColor('#FFFFFF');
    doc.fontSize(24).font('Helvetica-Bold').text(name, margin, 25);
    doc.fontSize(12).font('Helvetica').text(title, margin, 55);

    // Contact info inside the header box
    const contactParts = [];
    if (data.contact?.email) contactParts.push(data.contact.email);
    if (data.contact?.phone) contactParts.push(data.contact.phone);
    if (data.contact?.location) contactParts.push(data.contact.location);
    if (data.contact?.website) contactParts.push(data.contact.website);
    
    doc.fontSize(8.5).font('Helvetica').text(contactParts.join('  |  '), margin, 80);

    // Resume body starting position
    const startY = headerHeight + 50;
    doc.y = startY;

    // Helper to draw section header with modern styling (colored left border or color text)
    const drawSectionHeader = (titleText: string) => {
      const currentY = doc.y;
      doc.rect(margin, currentY, 4, 15).fill(themeColor);
      doc.fontSize(11).font('Helvetica-Bold').fillColor(themeColor).text(titleText.toUpperCase(), margin + 12, currentY + 2);
      doc.moveDown(0.8);
    };

    // 2. Summary/About
    if (bio) {
      drawSectionHeader('About Me');
      doc.fontSize(9.5).font('Helvetica').fillColor('#333333').text(bio, margin, doc.y, { align: 'justify', lineGap: 2.5 });
      doc.moveDown(1.2);
    }

    // 3. Skills
    if (data.skills && data.skills.length > 0) {
      drawSectionHeader('Skills & Competencies');
      
      const skillsText = data.skills.map((s: any) => `${s.name}${s.experienceLevel ? ` (${s.experienceLevel})` : ''}`).join('  •  ');
      doc.fontSize(9.5).font('Helvetica').fillColor('#333333').text(skillsText, margin, doc.y, { lineGap: 3 });
      doc.moveDown(1.2);
    }

    // 4. Experience
    if (data.experiences && data.experiences.length > 0) {
      drawSectionHeader('Professional Experience');
      for (const exp of data.experiences) {
        const start = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
        const end = exp.currentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
        const dateRange = start ? `${start} - ${end}` : '';

        // Role & Dates row
        const rowY = doc.y;
        doc.fontSize(10.5).font('Helvetica-Bold').fillColor('#1A1A1A').text(exp.position, margin, rowY);
        doc.fontSize(9).font('Helvetica-Bold').fillColor(accentColor).text(dateRange, { align: 'right' });
        
        // Company
        doc.fontSize(9.5).font('Helvetica-Oblique').fillColor('#555555').text(exp.company, margin, doc.y - 2);
        doc.moveDown(0.2);

        if (exp.description) {
          doc.fontSize(9).font('Helvetica').fillColor('#444444').text(exp.description, { align: 'justify', lineGap: 2 });
        }
        doc.moveDown(0.8);
      }
      doc.moveDown(0.4);
    }

    // 5. Projects
    if (data.projects && data.projects.length > 0) {
      drawSectionHeader('Key Projects');
      for (const proj of data.projects) {
        const rowY = doc.y;
        doc.fontSize(10.5).font('Helvetica-Bold').fillColor('#1A1A1A').text(proj.title, margin, rowY);
        
        const links = [];
        if (proj.githubUrl) links.push(`Repo: ${proj.githubUrl}`);
        if (proj.liveUrl) links.push(`Live: ${proj.liveUrl}`);
        
        if (links.length > 0) {
          doc.fontSize(8.5).font('Helvetica-Oblique').fillColor('#0056B3').text(links.join(' | '), { align: 'right' });
        }

        doc.fontSize(9).font('Helvetica').fillColor('#444444').text(proj.description, margin, doc.y + 2, { align: 'justify', lineGap: 2 });
        doc.moveDown(0.8);
      }
      doc.moveDown(0.4);
    }

    // 6. Education
    if (data.educations && data.educations.length > 0) {
      drawSectionHeader('Education');
      for (const edu of data.educations) {
        const start = edu.startDate ? new Date(edu.startDate).getFullYear() : '';
        const end = edu.endDate ? new Date(edu.endDate).getFullYear() : '';
        const dateRange = start ? `${start} - ${end}` : '';
        const gpaText = edu.cgpa ? ` (GPA: ${edu.cgpa})` : '';

        const rowY = doc.y;
        doc.fontSize(10.5).font('Helvetica-Bold').fillColor('#1A1A1A').text(edu.degree, margin, rowY);
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#666666').text(dateRange, { align: 'right' });
        
        doc.fontSize(9.5).font('Helvetica').fillColor('#444444').text(`${edu.college}${gpaText}`, margin, doc.y - 2);
        doc.moveDown(0.6);
      }
      doc.moveDown(0.4);
    }

    // 7. Certificates
    if (data.certificates && data.certificates.length > 0) {
      drawSectionHeader('Certifications');
      for (const cert of data.certificates) {
        const date = cert.date ? ` - ${new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric' })}` : '';
        doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#333333').text(cert.name, { continued: true })
           .font('Helvetica').fillColor('#555555').text(` [${cert.issuer}${date}]`);
        if (cert.credentialUrl) {
          doc.fontSize(8.5).font('Helvetica-Oblique').fillColor('#0056B3').text(`Verification URL: ${cert.credentialUrl}`);
        }
        doc.moveDown(0.4);
      }
    }
  }
}
export default ModernTemplate;
