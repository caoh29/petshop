import { Inter, Montserrat_Alternates } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const titleFont = Montserrat_Alternates({
  subsets: ['latin'],
  variable: '--font-title',
  weight: '700'
})