import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/providers/auth-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CareerOS — AI Resume Optimizer & ATS Resume Checker',
  description:
    'Upload your resume, paste any job description, and get an ATS score, keyword gaps, a rewritten resume, a cover letter, recruiter feedback, and interview prep in under a minute.',
  keywords: [
    'AI resume optimizer',
    'ATS resume checker',
    'resume analyzer',
    'AI resume builder',
    'interview preparation AI',
  ],
  openGraph: {
    title: 'CareerOS — Land More Interviews With AI',
    description:
      'Upload your resume, paste a job description, and get an ATS-optimized resume, cover letter, recruiter insights, and interview prep in under a minute.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CareerOS — Land More Interviews With AI',
    description:
      'Upload your resume, paste a job description, get an ATS-optimized resume and interview prep in under a minute.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
