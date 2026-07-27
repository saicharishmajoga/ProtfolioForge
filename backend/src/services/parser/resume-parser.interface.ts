import { ParsedResumeData } from '../../types';

export interface IResumeParser {
  /**
   * Parses a resume file (PDF or DOCX) and returns structured resume data.
   * @param filePath Path to the uploaded resume file
   * @returns Structured JSON representing the parsed resume
   */
  parse(filePath: string): Promise<ParsedResumeData>;
}
export default IResumeParser;
