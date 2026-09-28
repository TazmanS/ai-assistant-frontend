import { NavLink } from "react-router-dom";

type SideBarProps = {
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
};

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  const paths = {
    spark: (
      <>
        <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
        <path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    chat: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.7-3.4A7.5 7.5 0 1 1 20 11.5Z" />
        <path d="M9 11h.01M12 11h.01M15 11h.01" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
        <path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8" />
      </>
    ),
    grid: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19 13.5a7 7 0 0 0 0-3l1.5-1.2-1.5-2.6-1.9.7a7 7 0 0 0-2.6-1.5L14.2 4h-3l-.4 1.9a7 7 0 0 0-2.6 1.5l-1.9-.7-1.5 2.6L6.3 10.5a7 7 0 0 0 0 3l-1.5 1.2 1.5 2.6 1.9-.7a7 7 0 0 0 2.6 1.5l.4 1.9h3l.4-1.9a7 7 0 0 0 2.6-1.5l1.9.7 1.5-2.6L19 13.5Z" />
      </>
    ),
  };
  return (
    <svg {...props}>{paths[name as keyof typeof paths] ?? paths.spark}</svg>
  );
}

export function SideBar({ open, onClose, onNewChat }: SideBarProps) {
  const navClass =
    "flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] text-[#77817c] transition-colors hover:bg-[#eef3ef] hover:text-[#3a5c4b]";
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${navClass} ${isActive ? "bg-[#e8f1eb] font-semibold text-[#286149]" : ""}`;

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-30 border-0 bg-[#20382a66] md:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#e9eeea] bg-[#f7f9f7] px-[17px] pb-4 pt-[25px] transition-transform duration-200 md:translate-x-0 ${open ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
        aria-label="Workspace navigation"
      >
        <NavLink
          className="mb-[30px] ml-1.5 flex w-fit items-center gap-2.5 font-['Manrope'] text-xl font-bold tracking-[-0.7px] text-[#263a31]"
          to="/chat"
          onClick={onClose}
          aria-label="Yevhen AI home"
        >
          <span className="grid size-[31px] place-items-center rounded-[10px] bg-[#37785e] text-white shadow-sm">
            <Icon name="spark" size={19} />
          </span>
          <span>Yevhen AI</span>
        </NavLink>
        <button
          className="mb-7 flex h-[42px] w-full items-center gap-2.5 rounded-[9px] border border-[#dce7df] bg-[#347358] px-3 text-[13px] font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-[#2b654d]"
          onClick={onNewChat}
        >
          <Icon name="plus" size={17} />
          <span>New chat</span>
          <kbd className="ml-auto rounded bg-white/10 px-1.5 py-0.5 font-sans text-[10px] text-white/75">
            ⌘ K
          </kbd>
        </button>
        <div className="pl-2.5 text-[9px] font-bold tracking-[1.1px] text-[#9aa39e]">
          WORKSPACE
        </div>
        <nav className="mt-2.5 grid gap-1" aria-label="Main navigation">
          <NavLink className={linkClass} to="/chat" onClick={onClose}>
            <Icon name="chat" />
            <span>Assistant</span>
          </NavLink>
          <NavLink className={linkClass} to="/library" onClick={onClose}>
            <Icon name="book" />
            <span>Library</span>
          </NavLink>
          <NavLink className={linkClass} to="/explore" onClick={onClose}>
            <Icon name="grid" />
            <span>Explore</span>
          </NavLink>
        </nav>
        <div className="mt-[31px] pl-2.5 text-[9px] font-bold tracking-[1.1px] text-[#9aa39e]">
          RECENT
        </div>
        <p className="m-0 px-2.5 py-3 text-[11px] leading-relaxed text-[#a2aaa5]">
          Conversation history will be available soon.
        </p>
        <div className="mt-auto">
          <button className={`${navClass} mb-3 opacity-70`} disabled>
            <Icon name="settings" />
            <span>Settings</span>
            <span className="ml-auto text-[9px] text-[#a0aaa4]">Soon</span>
          </button>
          <div className="flex items-center gap-2.5 border-t border-[#e7ece8] px-2 py-3">
            <div
              className="grid size-[31px] place-items-center rounded-full bg-[#e3ebe4] text-xs font-bold text-[#49705a]"
              aria-hidden="true"
            >
              A
            </div>
            <div className="grid flex-1 gap-0.5">
              <strong className="text-[11px] font-semibold text-[#4c5952]">
                Personal workspace
              </strong>
              <span className="text-[10px] text-[#9ba49e]">Assistant v1</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
