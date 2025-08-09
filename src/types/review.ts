export type Review = {
  id: number;
  coverUrl: string;     // use the exact field name your backend sends
  title: string;
  author: string;
  rating: number;
  review: string;
  userName: string;     // camelCase, consistent everywhere
  createdAt: string;

  upvotes?: number;
  downvotes?: number;
  comments?: number;
  upvoted?: boolean;
  downvoted?: boolean;
};
