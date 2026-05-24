import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Re-review with a different model</DialogTitle>
          <DialogDescription>
            The router picked Sonnet last time. Pick a different tier to re-run.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button>Re-run</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">New review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New review</DialogTitle>
          <DialogDescription>Paste a snippet or link a GitHub file.</DialogDescription>
        </DialogHeader>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-fg-default font-medium">Title</span>
          <Input placeholder="auth/login.ts" />
        </label>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button>Start review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this review?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The issues and comments will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
