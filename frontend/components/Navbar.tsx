import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role);
        setLoggedIn(true);
      } catch {
        setLoggedIn(false);
        setRole(null);
      }
    } else {
      setLoggedIn(false);
      setRole(null);
    }
  }, [typeof window !== 'undefined' && localStorage.getItem('token')]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setRole(null);
    router.push('/');
  };

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-md sticky top-0 z-50">
      <Link href="/" className="font-extrabold text-2xl text-indigo-700 tracking-tight">SheBuilds Community</Link>
      <div className="flex items-center gap-6">
        <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium transition">Home</Link>
        {!loggedIn && <>
          <Link href="/login" className="text-gray-700 hover:text-indigo-600 font-medium transition">Login</Link>
          <Link href="/signup" className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-semibold">Sign Up</Link>
        </>}
        {loggedIn && <>
          <Link href={`/${role}/dashboard`} className="text-gray-700 hover:text-indigo-600 font-medium transition">Dashboard</Link>
          <button onClick={handleLogout} className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition font-semibold">Logout</button>
        </>}
      </div>
    </nav>
  );
} 