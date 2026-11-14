import React from 'react';
import dynamic from 'next/dynamic';

const AuthProfile = dynamic(() => import('authProfile/authProfile'), { ssr: false });
const Terminal = dynamic(() => import('terminal/terminal'), { ssr: false });
const Portfolio = dynamic(() => import('portfolio/portfolio'), { ssr: false });
const AiCopilot = dynamic(() => import('aiCopilot/aiCopilot'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">VLR Finance</h1>
          <nav className="mt-4 flex space-x-4">
            <a href="#auth" className="text-gray-600 hover:text-gray-900">Auth</a>
            <a href="#terminal" className="text-gray-600 hover:text-gray-900">Terminal</a>
            <a href="#portfolio" className="text-gray-600 hover:text-gray-900">Portfolio</a>
            <a href="#ai" className="text-gray-600 hover:text-gray-900">AI Copilot</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <section id="auth" className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Authentication & Profile</h2>
          <AuthProfile />
        </section>

        <section id="terminal" className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Trading Terminal</h2>
          <Terminal />
        </section>

        <section id="portfolio" className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
          <Portfolio />
        </section>

        <section id="ai" className="mb-8">
          <h2 className="text-xl font-semibold mb-4">AI Copilot</h2>
          <AiCopilot />
        </section>
      </main>
    </div>
  );
}
