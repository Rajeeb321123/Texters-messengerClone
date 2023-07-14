import './globals.css'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

import AuthContext from './context/AuthContext'
import ToasterContext from './context/ToasterContext'
import ActiveStatus from './components/ActiveStatus'



// for custom local font
const pixel = localFont({
  src: '../fonts/pixel.ttf',
  
  variable: '--font-pixel'
})

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Texters',
  description: 'Messenger Clone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${pixel.variable}`}>
      <body className={inter.className}>
        <AuthContext>

        <ToasterContext />
        <ActiveStatus />
        {children}
        </AuthContext>
        </body>
    </html>
  )
}
