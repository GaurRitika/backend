import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

export default function Home() {
  const [showModal, setShowModal] = useState<'login' | 'signup' | null>(null);
  const router = useRouter();

  const handleRoleSelect = (role: 'resident' | 'admin') => {
    if (showModal === 'login') router.push(`/${role}/login`);
    else if (showModal === 'signup') router.push(`/${role}/signup`);
    setShowModal(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-200 px-4">
        <div className="max-w-2xl w-full text-center mt-12">
          <div className="flex justify-center mb-6">
            <svg className="w-24 h-24 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="3" fill="#fff" />
              <path d="M16 32c0-4 8-4 8-8s-8-4-8-8" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
              <path d="M32 32c0-4-8-4-8-8s8-4 8-8" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-4">Welcome to SheBuilds Community Support</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Empowering residential communities with <span className="text-indigo-600 font-semibold">AI-driven support</span>.<br />
            Raise issues, track progress, and get help fast—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowModal('login')} className="px-8 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-lg font-semibold">Login</button>
            <button onClick={() => setShowModal('signup')} className="px-8 py-3 bg-orange-400 text-white rounded-lg shadow hover:bg-orange-500 transition text-lg font-semibold">Sign Up</button>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px] text-center animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6 text-indigo-700">Select your role</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                <button onClick={() => handleRoleSelect('resident')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition text-lg font-semibold">Resident</button>
                <button onClick={() => handleRoleSelect('admin')} className="px-6 py-2 bg-orange-400 text-white rounded-lg shadow hover:bg-orange-500 transition text-lg font-semibold">Admin</button>
              </div>
              <button onClick={() => setShowModal(null)} className="mt-2 text-gray-500 hover:text-indigo-600 transition">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 