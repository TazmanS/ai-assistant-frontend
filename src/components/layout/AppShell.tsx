import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { HealthStatus } from '../../services/chatApi'
import { Footer } from './Footer'
import { Header } from './Header'
import { SideBar } from './SideBar'

type AppShellProps = {
  children: ReactNode
  health: HealthStatus
  onCheckHealth: () => void
}

export function AppShell({ children, health, onCheckHealth }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const closeSidebar = () => setSidebarOpen(false)
  const startNewChat = () => {
    navigate(`/chat?new=${Date.now()}`)
    closeSidebar()
  }

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        navigate(`/chat?new=${Date.now()}`)
        setSidebarOpen(false)
      }
      if (event.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [navigate])

  return <div className="flex min-h-screen bg-[#fbfcfb] text-[#26332f]">
    <SideBar open={sidebarOpen} onClose={closeSidebar} onNewChat={startNewChat} />
    <div className="ml-0 flex min-h-screen w-full flex-col md:ml-64 md:w-[calc(100%_-_16rem)]">
      <Header health={health} onCheckHealth={onCheckHealth} onOpenSidebar={() => setSidebarOpen(true)} />
      <main className="flex flex-1 flex-col" id="main-content">{children}</main>
      <Footer />
    </div>
  </div>
}
