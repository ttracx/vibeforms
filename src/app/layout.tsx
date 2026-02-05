import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/shared/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VibeForms — Professional Form Builder',
  description: 'Build beautiful forms, collect responses, and analyze data. Powered by VibeCaaS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
