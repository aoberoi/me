import Link from 'next/link';

export default function Header() {
  return (
    <div className="bg-zinc-800 mb-6">
      <header className="max-w-screen-lg mx-auto px-4 py-6 text-white">
        <h1 className="font-banner text-4xl">
          <Link href="/">Ankur Oberoi</Link>
        </h1>
        <nav>
          <ul className="flex">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/posts">Posts</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
