export interface About {
  _id?: string;
  title: string;
  description: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}