import { useLocation } from 'react-router-dom'
import type { HealthStatus } from '../../services/chatApi'

type HeaderProps = {
  health: HealthStatus
  onCheckHealth: () => void
  onOpenSidebar: () => void
}

export function Header({ health, onCheckHealth, onOpenSidebar }: HeaderProps) {
  const { pathname } = useLocation()
  const pageName = pathname === '/library' ? 'Library' : pathname === '/explore' ? 'Explore' : 'Assistant'
  const healthText = health === 'online' ? 'Backend connected' : health === 'offline' ? 'Backend unavailable' : 'Checking backend'
  const dotClass = health === 'online' ? 'bg-[#48a778] shadow-[0_0_0_3px_#48a77820]' : health === 'offline' ? 'bg-[#d47767] shadow-[0_0_0_3px_#d4776720]' : 'bg-[#b8c1bc]'

  return <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center border-b border-[#edf0ed] bg-[#fbfcfb]/95 px-4 backdrop-blur md:h-[62px] md:px-[35px]">
    <button className="mr-2.5 grid size-8 place-items-center rounded-md text-[#708077] hover:bg-[#eef3ef] md:hidden" aria-label="Open navigation" onClick={onOpenSidebar}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>
    <div className="flex items-center gap-2.5 text-[11px] text-[#9aa39e]"><span>Workspace</span><span className="text-[#d2d8d4]">/</span><strong className="font-semibold text-[#47534d]">{pageName}</strong></div>
    <div className={`ml-auto flex items-center gap-2 text-[10px] ${health === 'offline' ? 'text-[#a95d4d]' : 'text-[#7d8982]'}`} role="status" aria-live="polite"><span className={`size-[7px] rounded-full ${dotClass}`} />{healthText}<button className="px-1 text-sm text-[#aab2ad] hover:text-[#52695a]" aria-label="Check backend connection" onClick={onCheckHealth} title="Check backend connection">↻</button></div>
  </header>
}
