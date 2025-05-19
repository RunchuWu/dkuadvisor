
export type Course = {
  id: string;
  code: string;
  title: string;
  description: string;
  department: string;
  credits: number;
  prerequisites?: string[];
  instructors?: string[];
  schedule?: {
    days: string[];
    time: string;
    location: string;
  };
  keywords?: string[];
};
