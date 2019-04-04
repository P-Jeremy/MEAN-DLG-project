export interface Post {
  id: string;
  title: string;
  content: string;
  image?: File | string;
  creator: string;
}
