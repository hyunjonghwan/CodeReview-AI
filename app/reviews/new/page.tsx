import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { NewReviewForm } from './new-review-form';

export const metadata: Metadata = {
  title: 'New review · CodeReview AI',
};

export default function NewReviewPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-10">
          <NewReviewForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
