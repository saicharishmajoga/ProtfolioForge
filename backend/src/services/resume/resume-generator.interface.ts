export interface IResumeGenerator {
  /**
   * Generates a resume PDF from portfolio data and writes it to a stream.
   * @param portfolioData Complete portfolio model data including sections
   * @param templateId The template identifier (e.g. 'modern', 'classic')
   * @param writeStream The write stream where the PDF will be output
   */
  generate(
    portfolioData: any,
    templateId: string,
    writeStream: NodeJS.WritableStream
  ): Promise<void>;
}
export default IResumeGenerator;
