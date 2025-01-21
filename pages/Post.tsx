export type Post = {
  slug: string;
  frontMatter: {
    title: string;
    date: string;
    author: string;
    description?: string;
    image?: string;
    tags?: string[];
    ratings?: number[];
  };
};
