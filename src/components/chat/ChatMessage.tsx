type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  truncated?: boolean;
};

export function ChatMessage({
  role,
  content,
  streaming = false,
  truncated = false,
}: ChatMessageProps) {
  return (
    <article
      className={`mb-7 flex gap-3 ${role === "user" ? "justify-end" : ""}`}
    >
      {role === "assistant" && (
        <div
          className="grid size-[29px] shrink-0 place-items-center rounded-[9px] bg-[#37785e] text-[17px] text-white shadow-sm"
          aria-hidden="true"
        >
          ✳
        </div>
      )}
      <div
        className={`max-w-[87%] sm:max-w-[570px] ${role === "user" ? "rounded-[13px_13px_3px_13px] bg-[#edf4ef] px-[15px] py-3" : ""}`}
      >
        <div
          className={`mb-1.5 text-[10px] font-semibold text-[#829087] ${role === "user" ? "sr-only" : ""}`}
        >
          {role === "assistant" ? "Yevhen AI" : "You"}
        </div>
        <div className="whitespace-pre-wrap break-words text-[13px] leading-7 text-[#425148]">
          {content ||
            (streaming ? (
              <span
                className="inline-flex h-5 items-center gap-1"
                aria-label="Assistant is responding"
              >
                <i className="size-[5px] animate-pulse rounded-full bg-[#72917b]" />
                <i className="size-[5px] animate-pulse rounded-full bg-[#72917b] [animation-delay:150ms]" />
                <i className="size-[5px] animate-pulse rounded-full bg-[#72917b] [animation-delay:300ms]" />
              </span>
            ) : null)}
        </div>
        {truncated && (
          <p
            className="mb-0 mt-3 rounded-lg border border-[#ead9b3] bg-[#fffaf0] px-3 py-2 text-xs leading-5 text-[#785f2d]"
            role="status"
          >
            Response limit reached. This answer may be incomplete.
          </p>
        )}
      </div>
    </article>
  );
}
