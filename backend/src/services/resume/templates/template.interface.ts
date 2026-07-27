import PDFDocument from 'pdfkit';

export interface IResumeTemplate {
  /**
   * Draws the portfolio details onto the PDFKit document.
   * @param doc The PDFKit PDFDocument instance
   * @param data Full portfolio details
   */
  draw(doc: typeof PDFDocument, data: any): void;
}
export default IResumeTemplate;
