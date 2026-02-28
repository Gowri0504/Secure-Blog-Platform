import type { ReactNode } from 'react'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="container">
          <header className="header">
            <a href="/feed" className="brand">Secure Blog Platform</a>
            <nav className="nav">
              <a href="/feed">Feed</a>
              <a href="/dashboard">Dashboard</a>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
