export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    liveUrl?: string;
    githubUrl?: string;
  }>;
  education: Array<{
    college: string;
    degree: string;
    cgpa?: number;
    startDate?: string;
    endDate?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    currentlyWorking?: boolean;
  }>;
}
