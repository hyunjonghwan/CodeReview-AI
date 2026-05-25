import Link from 'next/link';

const GITHUB_URL = 'https://github.com/hyunjonghwan/CodeReview-AI';

export function SiteFooter() {
  return (
    <footer className="border-border-default mt-auto border-t">
      <div className="text-fg-subtle mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-6 py-6 text-sm sm:flex-row">
        <span>© 2026 CodeReview AI</span>
        <div className="flex items-center gap-5">
          <a
            href={GITHUB_URL}
            className="hover:text-fg-default transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <Link href="/#features" className="hover:text-fg-default transition-colors">
            Docs
          </Link>
          <Link href="#" className="hover:text-fg-default transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
