import { HistoryWorkspace } from "@/components/dashboard/history-workspace";

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold text-white">Portfolio History</h1>
        <p className="text-gray-400">Review and compare your past optimizations</p>
      </div>
      <HistoryWorkspace />
    </div>
  );
}
