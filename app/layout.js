import './globals.css';
import { Baloo_2 } from 'next/font/google';

const font = Baloo_2({ subsets: ['latin'], weight: ['400', '600', '800'] });

export const metadata = {
  title: 'Thank you! 🎂',
  description: 'A little thank-you for your birthday wishes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
