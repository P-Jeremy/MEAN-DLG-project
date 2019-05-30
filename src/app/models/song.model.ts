export interface Song {
  id: string;
  title: string;
  author: string;
  lyrics?: string;
  tab?: File | string;
  tag?: [];
}
