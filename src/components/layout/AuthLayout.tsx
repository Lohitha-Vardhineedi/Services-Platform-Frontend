import React from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
      <section className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
        </header>
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
