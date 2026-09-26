import { useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react'

type ChatComposerProps = {
  value: string
  busy: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
}

export function ChatComposer({ value, busy, onChange, onSubmit, onStop }: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }, [value])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      if (busy) onStop()
      else onSubmit()
    }
  }

  return <div className="sticky bottom-0 mx-auto w-[calc(100%_-_2rem)] max-w-[690px] bg-gradient-to-b from-[#fbfcfb]/0 via-[#fbfcfb]/90 to-[#fbfcfb] px-0 pb-3.5 pt-3.5 md:w-[calc(100%_-_3rem)] md:pb-[17px]">
    <form className="rounded-xl border border-[#dfe7e1] bg-white px-4 pb-2 pt-3 shadow-[0_5px_18px_#36533f0b] transition focus-within:border-[#b9d0bf] focus-within:shadow-[0_5px_20px_#36533f10]" onSubmit={handleSubmit}>
      <textarea ref={textareaRef} value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown} placeholder="Ask anything..." rows={1} aria-label="Message the assistant" disabled={busy} maxLength={10000} className="block max-h-40 min-h-[34px] w-full resize-none border-0 bg-transparent text-xs leading-relaxed text-[#38483e] outline-none placeholder:text-[#a6afaa] disabled:opacity-70" />
      <div className="flex items-center justify-between pt-2"><span className="text-[10px] text-[#a3ada6]">Shift + Enter for a new line</span><div className="flex items-center gap-3"><span className="text-[9px] text-[#a5aea8]">{value.length.toLocaleString()} / 10,000</span>
        {busy ? <button className="grid size-[29px] place-items-center rounded-lg bg-[#9b5147] text-xs text-white transition hover:bg-[#813f36]" type="button" onClick={onStop} aria-label="Stop response">■</button> : <button className="grid size-[29px] place-items-center rounded-lg bg-[#36775b] text-white transition hover:-translate-y-px hover:bg-[#285e47] disabled:cursor-not-allowed disabled:bg-[#edf2ee] disabled:text-[#aab8ae]" type="submit" disabled={!value.trim()} aria-label="Send message"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg></button>}
      </div></div>
    </form>
    <p className="mb-0 mt-2 text-center text-[9px] text-[#a5ada8]">Yevhen AI can make mistakes. Check important information.</p>
  </div>
}
