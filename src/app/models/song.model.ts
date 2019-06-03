export interface Song {
  id: string;
  title: string;
  author: string;
  lyrics?: string;
  tab?: File | string;
  tags?: [TagsData] | string;
}

export interface TagsData {
  _id?: string;
  name: string;
}
