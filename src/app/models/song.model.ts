export interface Song {
  id: string;
  title: string;
  author: string;
  lyrics?: File | string;
  tab?: File | string;
}
