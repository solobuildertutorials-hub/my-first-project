"use client";

import { FormEvent, useEffect, useState } from "react";
import { type GuestbookEntry, supabase } from "@/lib/supabase";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function GuestbookClient() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void loadEntries();
  }, []);

  async function loadEntries() {
    setIsLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("guestbook_entries")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
      setEntries([]);
      setIsLoading(false);
      return;
    }

    setEntries((data ?? []) as GuestbookEntry[]);
    setIsLoading(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedMessage) {
      setErrorMessage("Name and message are both required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("guestbook_entries")
      .insert([{ name: trimmedName, message: trimmedMessage }])
      .select("id, name, message, created_at")
      .single();

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setEntries((currentEntries) => [data as GuestbookEntry, ...currentEntries]);
    setName("");
    setMessage("");
    setIsSubmitting(false);
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="rounded-[2rem] border border-border bg-panel-strong p-6 shadow-[var(--shadow)] backdrop-blur md:p-8">
        <div className="mb-6 space-y-3">
          <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">
            Sign the Book
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Add your message
          </h2>
          <p className="text-sm leading-7 text-muted">
            Keep it kind, keep it short, and it will appear at the top of the
            list.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Name</span>
            <input
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-4 focus:ring-[rgba(192,86,63,0.16)]"
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              placeholder="Ada Lovelace"
              autoComplete="name"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Message</span>
            <textarea
              className="min-h-36 w-full rounded-2xl border border-border bg-white px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-4 focus:ring-[rgba(192,86,63,0.16)]"
              name="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={500}
              placeholder="Loved the project. Shipping a note from New York."
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-base font-semibold text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Posting..." : "Post message"}
          </button>
        </form>

        {errorMessage ? (
          <p className="mt-4 rounded-2xl border border-[rgba(192,86,63,0.2)] bg-[rgba(192,86,63,0.08)] px-4 py-3 text-sm text-accent-deep">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-border bg-panel-strong p-6 shadow-[var(--shadow)] backdrop-blur md:p-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="space-y-3">
            <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">
              Latest Messages
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Newest first
            </h2>
          </div>
          <button
            type="button"
            onClick={() => void loadEntries()}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-white"
          >
            Refresh
          </button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-3xl border border-dashed border-border px-5 py-10 text-center text-muted">
              Loading messages...
            </div>
          ) : null}

          {!isLoading && entries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border px-5 py-10 text-center text-muted">
              No messages yet. Be the first to sign the guest book.
            </div>
          ) : null}

          {!isLoading
            ? entries.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-3xl border border-border bg-white/90 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {entry.name}
                    </h3>
                    <p className="text-sm text-muted">
                      {dateFormatter.format(new Date(entry.created_at))}
                    </p>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-base leading-7 text-foreground">
                    {entry.message}
                  </p>
                </article>
              ))
            : null}
        </div>
      </div>
    </section>
  );
}
