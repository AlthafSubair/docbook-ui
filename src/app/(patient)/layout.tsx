import React from 'react'
import Header from '../components/ui/Header'

const PatientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}

export default PatientLayout