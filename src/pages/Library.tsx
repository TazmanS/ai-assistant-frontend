function Library() {
  return <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-12 md:px-10 md:py-16" aria-labelledby="library-heading">
    <p className="mb-3 text-[10px] font-bold tracking-[1.6px] text-[#7c9485]">YOUR WORKSPACE</p>
    <h1 id="library-heading" className="m-0 font-['Manrope'] text-3xl font-semibold tracking-tight text-[#293c32]">Library</h1>
    <p className="mb-8 mt-2 max-w-xl text-sm leading-6 text-[#89928e]">A home for the things you save and want to come back to.</p>
    <div className="grid min-h-64 flex-1 place-items-center rounded-2xl border border-dashed border-[#dce7df] bg-white/70 p-8 text-center">
      <div><span className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-[#edf4ef] text-xl text-[#4f7d62]" aria-hidden="true">▤</span><h2 className="m-0 text-sm font-semibold text-[#43534a]">Your library is ready when you are</h2><p className="mb-0 mt-2 text-xs text-[#9aa49e]">Saved conversations and notes will show up here.</p></div>
    </div>
  </section>
}

export default Library
