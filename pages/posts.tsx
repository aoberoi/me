import type { GetStaticProps } from 'next';
import { PublishedPost, getRecentPosts } from '../lib/post';
import { formatInTimeZone } from '../lib/date';
import Layout from '../components/Layout';
import Link from 'next/link';

interface PostsProps {
  posts: PublishedPost[];
}


export default function PostIndex({ posts }: PostsProps) {
  return (
    <Layout title="Posts">
      <section className="max-w-screen-lg mx-auto px-4">
        <h2 className="text-2xl font-banner my-2">Posts</h2>
        <table className="w-full mx-0 mt-0 mb-4 p-0">
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug}>
                <td className="pr-4 py-3 border-b border-gray-200/10 text-right opacity-40">{formatInTimeZone(post.date * 1000, 'MMMM do, R', 'UTC')}</td>
                <td className="pl-4 py-3 border-b border-gray-200/10 text-left">
                  <Link href={`/p/${post.slug}`} passHref={true}>
                    <a className="text-red-700 underline">{post.title}</a>
                  </Link>
                </td>
              </tr>
             ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<PostsProps> = async () => {
  const posts = await getRecentPosts();

  return {
    props: {
      posts,
    },
  };
};
