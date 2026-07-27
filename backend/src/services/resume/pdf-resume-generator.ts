import PDFDocument from 'pdfkit';
import { IResumeGenerator } from './resume-generator.interface';
import { IResumeTemplate } from './templates/template.interface';
import { ClassicTemplate } from './templates/classic.template';
import { ModernTemplate } from './templates/modern.template';
import { BadRequestError } from '../../utils/custom-errors';
import { logger } from '../../config/logger';

export class PdfResumeGenerator implements IResumeGenerator {
  private templates: Record<string, IResumeTemplate> = {
    classic: new ClassicTemplate(),
    modern: new ModernTemplate(),
  };

  async generate(
    portfolioData: any,
    templateId: string,
    writeStream: NodeJS.WritableStream
  ): Promise<void> {
    logger.info(`Generating PDF resume using template: ${templateId}`);
    
    const template = this.templates[templateId.toLowerCase()];
    if (!template) {
      throw new BadRequestError(`Unsupported resume template: ${templateId}. Available templates: classic, modern.`);
    }

    try {
      // PDFDocument requires an options block
      const doc = new PDFDocument({
        size: 'A4',
        bufferPages: true,
      });

      // Pipe to output stream (typically express response or a file write stream)
      doc.pipe(writeStream);

      // Render the template structure
      template.draw(doc as any, portfolioData);

      // Finalize the PDF
      doc.end();
      logger.info('PDF generation completed successfully');
    } catch (error: any) {
      logger.error(`Error during PDF generation: ${error.message}`);
      throw error;
    }
  }
}

export const resumeGenerator = new PdfResumeGenerator();
export default resumeGenerator;
