export interface Post {
  id: string;
  title: string;
  content: string;
  image?: File | string;
  creator_id: string;
  creator_pseudo?: string;
  date?: Date;
}
