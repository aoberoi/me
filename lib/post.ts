import type { JsonObject } from 'type-fest';
import { join as pathJoin } from 'path';
import { types } from 'util';
import { readdir, readFile } from 'fs/promises';
import matter, { GrayMatterFile, Input } from 'gray-matter';


export interface Post extends JsonObject {
  slug: string;
  title: string;
  date: number; // seconds since unix epoch
  content: string;
}

// This simple implementation only supports posts as `.md` files at the top level of the directory

const postsDirectory = pathJoin(process.cwd(), '_posts');

function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, '');
}

// function slugToFilename(slug: string): string {
//   return `${slug}.md`;
// }

function fileToPost(file: GrayMatterFile<Input>, slug: string): Post | undefined {
  if (typeof file.data.title === 'string' && types.isDate(file.data.date)) {
    console.log(file.data.date);
    return {
      slug,
      title: file.data.title,
      date: Math.floor(file.data.date.getTime() / 1000),
      content: file.content,
    };
  }
}

function isPost(maybePost: Post | undefined): maybePost is Post {
  return !!maybePost;
}

export async function getAllPosts(): Promise<Post[]> {
  const filenames = await readdir(postsDirectory);

  const postPromises = filenames.map(async (filename) => {
    const fullFilename = pathJoin(postsDirectory, filename);
    const slug = filenameToSlug(filename);
    const contents = await readFile(fullFilename, 'utf8')
    const markdown = matter(contents);
    return fileToPost(markdown, slug);
  });

  const posts = await Promise.all(postPromises);

  return posts.filter(isPost);
}
