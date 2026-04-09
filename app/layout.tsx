import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Professor Inspirador - Matemática',
  description: 'Aprenda matemática de forma simples e inspiradora.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-[#fdfbf7] text-slate-800 antialiased min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
