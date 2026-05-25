import Link from 'next/link';
import { ArrowRight } from '@/components/icons';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <RoutingDiagram />
        <FeatureGrid />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1 className="text-fg-default text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
          AI code review that picks the right model
        </h1>
        <p className="text-fg-muted mt-6 max-w-2xl text-lg leading-relaxed">
          Haiku for style. Sonnet for review. Opus for deep analysis. You pay only for what the task
          actually needs.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/reviews/new">
              Start a review
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#routing">See how routing works</Link>
          </Button>
        </div>
        <p className="text-fg-subtle mt-6 inline-flex items-center gap-2 text-sm">
          <Star className="text-accent size-4" />
          70% lower cost vs always-Opus on real PRs
        </p>
      </div>
    </section>
  );
}

function RoutingDiagram() {
  const lanes = [
    {
      input: '50 LOC',
      detail: 'formatDate.ts',
      model: 'Haiku',
      tone: 'text-emerald-500',
      note: 'style nits',
    },
    {
      input: '300 LOC',
      detail: 'components/Form.tsx',
      model: 'Sonnet',
      tone: 'text-amber-500',
      note: 'general review',
    },
    {
      input: '8 files · 2k LOC',
      detail: 'services/payment/',
      model: 'Opus',
      tone: 'text-accent',
      note: 'deep analysis',
    },
  ];

  return (
    <section id="routing" className="mx-auto w-full max-w-[1280px] px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-fg-default text-2xl font-semibold tracking-tight sm:text-3xl">
          One router, three tiers
        </h2>
        <p className="text-fg-muted mt-3">
          <code className="font-mono text-sm">detectTaskType()</code> reads the input and routes to
          the cheapest model that can handle it.
        </p>
      </div>
      <Card className="p-6 sm:p-8">
        <div className="grid gap-4">
          {lanes.map((lane) => (
            <div
              key={lane.model}
              className="border-border-default bg-bg-default grid grid-cols-1 items-center gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr]"
            >
              <div className="font-mono text-sm">
                <div className="text-fg-default">{lane.detail}</div>
                <div className="text-fg-subtle text-xs">{lane.input}</div>
              </div>
              <Arrow className="text-fg-subtle hidden size-5 sm:block" />
              <div className="border-border-default bg-bg-subtle rounded-md border px-3 py-2 text-center font-mono text-xs">
                detectTaskType()
              </div>
              <Arrow className="text-fg-subtle hidden size-5 sm:block" />
              <div className={`text-right font-mono text-sm font-semibold ${lane.tone}`}>
                {lane.model}
                <div className="text-fg-subtle text-xs font-normal">{lane.note}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    {
      icon: RouteIcon,
      title: 'Smart Routing',
      body: '3-tier model selection by complexity. The router explains its choice for every review.',
    },
    {
      icon: CommentIcon,
      title: 'Inline Reviews',
      body: 'Line-level comments with a diff viewer. Apply, copy, or skip — one click.',
    },
    {
      icon: ChartIcon,
      title: 'Cost Dashboard',
      body: 'Track every token across Haiku/Sonnet/Opus and prove the savings vs always-Opus.',
    },
  ];

  return (
    <section id="features" className="mx-auto w-full max-w-[1280px] px-6 py-16">
      <div className="grid gap-6 md:grid-cols-3">
        {features.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="p-6">
            <Icon className="text-accent size-6" />
            <h3 className="text-fg-default mt-4 text-base font-semibold">{title}</h3>
            <p className="text-fg-muted mt-2 text-sm leading-relaxed">{body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-6 py-20">
      <Card className="flex flex-col items-center gap-4 p-10 text-center">
        <h2 className="text-fg-default text-2xl font-semibold tracking-tight sm:text-3xl">
          Ready to review your code?
        </h2>
        <p className="text-fg-muted">No signup required for the paste mode.</p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/reviews/new">
            Start free
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Card>
    </section>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.95 6.39 6.55.71-4.9 4.49 1.42 6.5L12 17.27 5.98 20.59l1.42-6.5L2.5 9.6l6.55-.71L12 2.5z" />
    </svg>
  );
}

function RouteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="19" r="3" />
      <circle cx="18" cy="5" r="3" />
      <path d="M6.7 17.3a4 4 0 0 1 0-5.6l4-4a4 4 0 1 1 5.6 5.6l-4 4a4 4 0 0 1-5.6 0Z" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-7" />
    </svg>
  );
}
