const ideas = [
  { icon: '✳', title: 'Think it through', copy: 'Work through a challenge or explore a fresh idea.' },
  { icon: '↗', title: 'Make something', copy: 'Draft, shape, or improve your next piece of work.' },
  { icon: '◇', title: 'Learn something', copy: 'Get a clear explanation and find a useful next step.' },
]

function Explore() {
  return <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-12 md:px-10 md:py-16" aria-labelledby="explore-heading">
    <p className="mb-3 text-[10px] font-bold tracking-[1.6px] text-[#7c9485]">GET STARTED</p>
    <h1 id="explore-heading" className="m-0 font-['Manrope'] text-3xl font-semibold tracking-tight text-[#293c32]">Explore</h1>
    <p className="mb-8 mt-2 max-w-xl text-sm leading-6 text-[#89928e]">A few ways to get moving with your assistant.</p>
    <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea) => <article key={idea.title} className="rounded-xl border border-[#e8ede9] bg-white p-5 shadow-sm"><span className="mb-4 grid size-9 place-items-center rounded-lg bg-[#edf4ef] text-base text-[#4f7d62]" aria-hidden="true">{idea.icon}</span><h2 className="m-0 text-sm font-semibold text-[#43534a]">{idea.title}</h2><p className="mb-0 mt-2 text-xs leading-5 text-[#89928e]">{idea.copy}</p></article>)}
    </div>
  </section>
}

export default Explore
