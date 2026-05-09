import GuestbookClient from "./guestbook-client";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 md:py-14">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-5">
          <span className="inline-flex rounded-full border border-border bg-panel px-4 py-2 text-sm tracking-[0.22em] text-muted uppercase shadow-[var(--shadow)] backdrop-blur">
            Community Guest Book
          </span>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
              Leave a note for the next visitor.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted md:text-xl">
              Add your name, share a message, and watch the newest entries rise
              to the top in real time.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-panel p-6 shadow-[var(--shadow)] backdrop-blur md:p-8">
          <div className="space-y-3">
            <p className="text-sm font-medium tracking-[0.2em] text-accent uppercase">
              Backed by Supabase
            </p>
            <p className="text-sm leading-7 text-muted">
              Messages are stored in a public guest book table with Row Level
              Security enabled for open reads and inserts.
            </p>
          </div>
        </div>
      </section>

      <GuestbookClient />
    </main>
  );
}
