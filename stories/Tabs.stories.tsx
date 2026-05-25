import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="issues" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="issues">Issues</TabsTrigger>
        <TabsTrigger value="source">Source</TabsTrigger>
      </TabsList>
      <TabsContent value="summary" className="text-fg-muted text-sm">
        Overview of this review: 3 issues found, 1 critical.
      </TabsContent>
      <TabsContent value="issues" className="text-fg-muted text-sm">
        Detailed list of issues with line numbers and suggested fixes.
      </TabsContent>
      <TabsContent value="source" className="text-fg-muted text-sm">
        Original source code, syntax highlighted.
      </TabsContent>
    </Tabs>
  ),
};

export const ReviewDetail: Story = {
  name: 'Review detail (wireframe §3)',
  render: () => (
    <Card className="w-[520px] p-4">
      <Tabs defaultValue="issues">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="issues">Issues (3)</TabsTrigger>
          <TabsTrigger value="source">Source</TabsTrigger>
        </TabsList>
        <TabsContent value="issues">
          <div className="text-fg-default flex flex-col gap-2 py-2 text-sm">
            <div>▲ Critical · Security · L12</div>
            <div>◆ Major · Performance · L5–9</div>
            <div>○ Minor · Style · L1</div>
          </div>
        </TabsContent>
        <TabsContent value="summary" className="text-fg-muted py-2 text-sm">
          1 security, 1 perf, 1 style. Router picked Opus (deep-analysis).
        </TabsContent>
        <TabsContent value="source" className="text-fg-muted py-2 font-mono text-xs">
          export async function login(email, password) {'{ ... }'}
        </TabsContent>
      </Tabs>
    </Card>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="summary" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="issues" disabled>
          Issues (locked)
        </TabsTrigger>
        <TabsTrigger value="source" disabled>
          Source (locked)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="summary" className="text-fg-muted text-sm">
        Sign in to unlock issue-level review and source navigation.
      </TabsContent>
    </Tabs>
  ),
};
