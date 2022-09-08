export interface Post<TDate = Date> {
  id: string;
  title: string;
  text: string;
  created_at: TDate;
  updated_at: TDate;
  version: number;
  versions?: Post<TDate>[];
}
