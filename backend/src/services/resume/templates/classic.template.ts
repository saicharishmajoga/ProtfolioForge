import { IResumeTemplate } from './template.interface';

export class ClassicTemplate implements IResumeTemplate {
  draw(doc: any, data: any): void {
    const margin = 50;
    doc.page.margins = { top: margin, bottom: margin, left: margin, right: margin };

    const name = data.profile?.fullName || data.user?.name || 'Your Name';
    const title = data.profile?.title || 'Professional Title';
    const bio = data.about?.text || data.profile?.bio || '';
    
    // 1. Header (Centered)
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#1A1A1A').text(name, { align: 'center' });
    doc.fontSize(12).font('Helvetica-Oblique').fillColor('#555555').text(title, { align: 'center' });
    doc.moveDown(0.5);

    // Contact info line
    const contactParts = [];
    if (data.contact?.email) contactParts.push(data.contact.email);
    if (data.contact?.phone) contactParts.push(data.contact.phone);
    if (data.contact?.location) contactParts.push(data.contact.location);
    if (data.contact?.website) contactParts.push(data.contact.website);
    
    doc.fontSize(9).font('Helvetica').fillColor('#444444').text(contactParts.join('  |  '), { align: 'center' });
    doc.moveDown(1);
    
    // Divider line
    doc.moveTo(margin, doc.y).lineTo(doc.page.width - margin, doc.y).strokeColor('#CCCCCC').stroke();
    doc.moveDown(1);

    // Helper to draw section header
    const drawSectionHeader = (titleText: string) => {
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#1A1A1A').text(titleText.toUpperCase());
      doc.moveDown(0.2);
      doc.moveTo(margin, doc.y).lineTo(doc.page.width - margin, doc.y).strokeColor('#E0E0E0').stroke();
      doc.moveDown(0.4);
    };

    // 2. Summary/About
    if (bio) {
      drawSectionHeader('Professional Summary');
      doc.fontSize(10).font('Helvetica').fillColor('#333333').text(bio, { align: 'justify', lineGap: 3 });
      doc.moveDown(1.2);
    }

    // 3. Skills
    if (data.skills && data.skills.length > 0) {
      drawSectionHeader('Skills');
      
      // Group by category if possible
      const categorized: Record<string, string[]> = {};
      data.skills.forEach((s: any) => {
        const cat = s.category || 'General';
        if (!categorized[cat]) categorized[cat] = [];
        categorized[cat].push(s.name);
      });

      for (const [category, skillList] of Object.entries(categorized)) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#333333').text(`${category}: `, { listType: 'none', continued: true })
           .font('Helvetica').fillColor('#444444').text(skillList.join(', '));
        doc.moveDown(0.3);
      }
      doc.moveDown(1);
    }

    // 4. Experience
    if (data.experiences && data.experiences.length > 0) {
      drawSectionHeader('Work Experience');
      for (const exp of data.experiences) {
        // Date parsing
        const start = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
        const end = exp.currentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
        const dateRange = start ? `(${start} - ${end})` : '';

        doc.fontSize(11).font('Helvetica-Bold').fillColor('#1A1A1A').text(exp.position, { continued: true })
           .font('Helvetica').fillColor('#444444').text(`  at  `, { continued: true })
           .font('Helvetica-Bold').fillColor('#333333').text(exp.company, { continued: true })
           .font('Helvetica-Oblique').fillColor('#666666').text(`   ${dateRange}`, { align: 'right' });
        doc.moveDown(0.2);
        
        if (exp.description) {
          doc.fontSize(10).font('Helvetica').fillColor('#444444').text(exp.description, { align: 'justify', lineGap: 2 });
        }
        doc.moveDown(0.8);
      }
      doc.moveDown(0.4);
    }

    // 5. Projects
    if (data.projects && data.projects.length > 0) {
      drawSectionHeader('Key Projects');
      for (const proj of data.projects) {
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#1A1A1A').text(proj.title);
        
        const links = [];
        if (proj.githubUrl) links.push(`GitHub: ${proj.githubUrl}`);
        if (proj.liveUrl) links.push(`Live: ${proj.liveUrl}`);
        
        if (links.length > 0) {
          doc.fontSize(9).font('Helvetica-Oblique').fillColor('#0056B3').text(links.join('   |   '));
        }
        doc.moveDown(0.1);

        doc.fontSize(10).font('Helvetica').fillColor('#444444').text(proj.description, { align: 'justify', lineGap: 2 });
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
        const dateRange = start ? `(${start} - ${end})` : '';
        const gpaText = edu.cgpa ? `   GPA: ${edu.cgpa}` : '';

        doc.fontSize(11).font('Helvetica-Bold').fillColor('#1A1A1A').text(edu.degree, { continued: true })
           .font('Helvetica-Oblique').fillColor('#666666').text(`   ${dateRange}`)
           .font('Helvetica').fillColor('#444444').text(`${edu.college}${gpaText}`);
        doc.moveDown(0.6);
      }
      doc.moveDown(0.4);
    }

    // 7. Certificates & Achievements
    if ((data.certificates && data.certificates.length > 0) || (data.achievements && data.achievements.length > 0)) {
      drawSectionHeader('Certifications & Achievements');
      
      if (data.certificates) {
        for (const cert of data.certificates) {
          const date = cert.date ? ` - ${new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric' })}` : '';
          doc.fontSize(10).font('Helvetica-Bold').fillColor('#333333').text(cert.name, { continued: true })
             .font('Helvetica').fillColor('#555555').text(` (${cert.issuer}${date})`);
          if (cert.credentialUrl) {
            doc.fontSize(9).font('Helvetica-Oblique').fillColor('#0056B3').text(`Verify: ${cert.credentialUrl}`);
          }
          doc.moveDown(0.4);
        }
      }

      if (data.achievements) {
        for (const ach of data.achievements) {
          doc.fontSize(10).font('Helvetica-Bold').fillColor('#333333').text(ach.title);
          if (ach.description) {
            doc.fontSize(9).font('Helvetica').fillColor('#555555').text(ach.description);
          }
          doc.moveDown(0.4);
        }
      }
    }
  }
}
export default ClassicTemplate;
