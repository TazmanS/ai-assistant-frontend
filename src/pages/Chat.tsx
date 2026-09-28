import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatComposer } from "../components/chat/ChatComposer";
import { ChatMessage } from "../components/chat/ChatMessage";
import { RESPONSE_TRUNCATED_MARKER, streamChat } from "../services/chatApi";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  truncated?: boolean;
};

const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const suggestions = [
  {
    icon: "✳",
    title: "Help me brainstorm",
    description: "Explore ideas for a project or problem",
  },
  {
    icon: "▤",
    title: "Explain a concept",
    description: "Get a clear, thoughtful explanation",
  },
  {
    icon: "↗",
    title: "Write something",
    description: "Draft, edit, or find the right words",
  },
  {
    icon: "◇",
    title: "Plan my next steps",
    description: "Turn a big goal into a simple plan",
  },
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const abortController = useRef<AbortController | null>(null);
  const busyRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();
  const newChat = searchParams.get("new");

  useEffect(() => {
    if (!newChat) return;
    if (busyRef.current) abortController.current?.abort();
    setMessages([]);
    setError("");
    setInput("");
  }, [newChat]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const stopResponse = useCallback(() => {
    abortController.current?.abort();
  }, []);

  const sendMessage = useCallback(async (rawText: string) => {
    const text = rawText.trim();
    if (!text || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    setInput("");
    const userId = createId();
    const assistantId = createId();
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", content: text },
      { id: assistantId, role: "assistant", content: "" },
    ]);
    const controller = new AbortController();
    abortController.current = controller;
    let receivedContent = false;
    let truncated = false;
    let markerCarry = "";
    const appendAssistantText = (content: string) => {
      if (!content) return;
      receivedContent = true;
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, content: message.content + content }
            : message,
        ),
      );
    };
    const markTruncated = () => {
      truncated = true;
      receivedContent = true;
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantId
            ? { ...message, truncated: true }
            : message,
        ),
      );
    };
    const handleStreamChunk = (chunk: string) => {
      if (truncated || !chunk) return;
      const combined = markerCarry + chunk;
      const markerIndex = combined.indexOf(RESPONSE_TRUNCATED_MARKER);
      if (markerIndex >= 0) {
        appendAssistantText(combined.slice(0, markerIndex));
        markerCarry = "";
        markTruncated();
        return;
      }

      let carryLength = Math.min(
        combined.length,
        RESPONSE_TRUNCATED_MARKER.length - 1,
      );
      while (
        carryLength > 0 &&
        !RESPONSE_TRUNCATED_MARKER.startsWith(combined.slice(-carryLength))
      )
        carryLength -= 1;
      appendAssistantText(combined.slice(0, combined.length - carryLength));
      markerCarry = combined.slice(combined.length - carryLength);
    };

    try {
      await streamChat(text, handleStreamChunk, controller.signal);
      if (!truncated) appendAssistantText(markerCarry);
      markerCarry = "";
      if (!receivedContent)
        setError("The assistant returned an empty response. Please try again.");
    } catch (caught) {
      if (!truncated) appendAssistantText(markerCarry);
      markerCarry = "";
      const wasCancelled =
        caught instanceof DOMException && caught.name === "AbortError";
      if (!receivedContent)
        setMessages((current) =>
          current.filter((message) => message.id !== assistantId),
        );
      if (!wasCancelled) {
        const description =
          caught instanceof Error
            ? caught.message
            : "Please try again in a moment.";
        setError(`Couldn't get a response. ${description}`);
      }
    } finally {
      abortController.current = null;
      busyRef.current = false;
      setBusy(false);
    }
  }, []);

  const submitInput = () => {
    void sendMessage(input);
  };
  const suggestionClass =
    "group relative flex min-h-[86px] flex-col items-start rounded-[10px] border border-[#e8ede9] bg-white px-3.5 py-3 text-left shadow-[0_2px_6px_#31483805] transition duration-200 hover:-translate-y-0.5 hover:border-[#cbdccf] hover:shadow-[0_6px_18px_#3148380a] disabled:cursor-default disabled:opacity-60 sm:px-3.5";

  return (
    <>
      <section
        className={`relative flex flex-1 justify-center ${messages.length ? "items-start" : ""}`}
        aria-label="Chat conversation"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="my-auto w-[calc(100%_-_3rem)] max-w-[690px] py-12 text-center font-['DM_Sans'] sm:w-[calc(100%_-_3rem)]">
            <div className="flex items-center justify-center gap-[11px] text-[9px] font-bold tracking-[1.65px] text-[#7c9485]">
              <span className="h-px w-[19px] bg-[#c8d7cc]" />
              YOUR AI WORKSPACE
              <span className="h-px w-[19px] bg-[#c8d7cc]" />
            </div>
            <h1 className="mb-3 mt-5 font-['Manrope'] text-[clamp(39px,8vw,55px)] font-medium leading-[1.13] tracking-[-2.2px] text-[#293c32]">
              A little clarity
              <br />
              goes a <span className="text-[#558365]">long way.</span>
            </h1>
            <p className="text-[13px] leading-[1.8] text-[#8a9690]">
              A thoughtful space to ask questions, explore ideas,
              <br className="hidden sm:block" /> and make your next move.
            </p>
            <div className="mx-auto mt-9 grid w-full max-w-[550px] grid-cols-1 gap-2.5 text-left min-[391px]:grid-cols-2">
              {suggestions.map((item) => (
                <button
                  key={item.title}
                  className={`${suggestionClass} min-[391px]:min-h-[86px] max-[390px]:min-h-[70px] max-[390px]:justify-center max-[390px]:pl-[49px]`}
                  onClick={() => void sendMessage(item.title)}
                  disabled={busy}
                >
                  <span className="mb-2 grid size-[27px] place-items-center rounded-[7px] bg-[#edf4ef] text-[15px] text-[#4f7d62] max-[390px]:absolute max-[390px]:left-3 max-[390px]:top-[21px] max-[390px]:mb-0">
                    {item.icon}
                  </span>
                  <span className="text-[11px] font-semibold text-[#43534a]">
                    {item.title}
                  </span>
                  <span className="mt-0.5 text-[10px] text-[#9aa49e] max-[390px]:text-[9px]">
                    {item.description}
                  </span>
                  <span className="absolute right-3.5 top-3.5 text-xs text-[#b6c1b9]">
                    ↗
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto w-[calc(100%_-_2rem)] max-w-[690px] py-6 md:w-[calc(100%_-_3rem)] md:pt-[43px]">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                streaming={
                  busy &&
                  message.role === "assistant" &&
                  !message.content &&
                  !message.truncated
                }
                truncated={message.truncated}
              />
            ))}
            <div ref={endRef} />
          </div>
        )}
        {error && (
          <div
            className="fixed bottom-28 right-6 z-30 flex max-w-[min(520px,calc(100%_-_2rem))] items-center gap-4 rounded-lg border border-[#f2d0c7] bg-[#fff8f5] px-3.5 py-3 text-xs text-[#874a3c] shadow-lg"
            role="alert"
          >
            <span>{error}</span>
            <button
              className="text-lg text-[#966457]"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}
      </section>
      <ChatComposer
        value={input}
        busy={busy}
        onChange={setInput}
        onSubmit={submitInput}
        onStop={stopResponse}
      />
    </>
  );
}

export default ChatPage;
