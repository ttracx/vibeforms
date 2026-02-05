'use client';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        © 2026 VibeForms powered by{' '}
        <a href="https://vibecaas.com/" className="text-indigo-600 hover:text-indigo-800 font-medium">
          VibeCaaS.com
        </a>{' '}
        a division of{' '}
        <a href="https://neuralquantum.ai/" className="text-indigo-600 hover:text-indigo-800 font-medium">
          NeuralQuantum.ai LLC
        </a>
        . All rights reserved.
      </div>
    </footer>
  );
}
