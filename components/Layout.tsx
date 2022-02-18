import type { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const defaultTitle = 'Ankur Oberoi';

export default function Layout({ children, title }: LayoutProps) {
  const formattedTitle = title ?
    `${title} ⥋ ${defaultTitle}` :
    defaultTitle;

  return (
    <div>
      <Head>
        <title>{ formattedTitle  }</title>
      </Head>
      <Header />
      <div>{ children }</div>
    </div>
  );
}
