import Link from 'next/link';
import { ArrowRight, LogoMark } from '@/components/icons';
import { Button } from '@/components/ui/button';

const GITHUB_URL = 'https://github.com/hyunjonghwan/CodeReview-AI';

export function SiteHeader() {
  return (
    <header className="border-border-default supports-[backdrop-filter]:bg-bg-default/70 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <LogoMark className="text-accent size-5" />
          <span>CodeReview AI</span>
        </Link>
        <nav className="text-fg-muted hidden items-center gap-6 text-sm md:flex">
          <Link href="/#features" className="hover:text-fg-default transition-colors">
            Features
          </Link>
          <Link href="/#routing" className="hover:text-fg-default transition-colors">
            Routing
          </Link>
          <a
            href={GITHUB_URL}
            className="hover:text-fg-default transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/reviews">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/reviews/new">
              Start
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
