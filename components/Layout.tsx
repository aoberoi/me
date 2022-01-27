import type { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({
  children,
  title = 'Ankur Oberoi',
}: LayoutProps) {
  return (<div>
    <Head>
      <title>{ title }</title>
    </Head>
    <Header />
    <div>{ children }</div>
  </div>);
}
