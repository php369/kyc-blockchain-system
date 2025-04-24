import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '../components/Providers'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'KYC Blockchain System',
  description: 'A decentralized KYC verification system using blockchain technology',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}