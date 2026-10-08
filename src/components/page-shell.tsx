import { Breadcrumbs } from "./breadcrumbs";

export function PageShell({ title, intro, crumb, children }: { title: string; intro?: string; crumb: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <Breadcrumbs items={[{ label: crumb }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-5xl">{title}</h1>
      {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
      <div className="mt-8">{children}</div>
    </div>
  );
}

/** Markiert Stellen, die der Betreiber vor dem Livegang ausfüllen muss. */
export function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="rounded bg-mid-soft px-1 text-fg">[{children}]</mark>;
}
