export interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  liveUrl?: string;
  githubUrl?: string;
}