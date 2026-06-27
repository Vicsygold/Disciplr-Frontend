import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CountdownDeadline } from '../components/CountdownDeadline';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Text } from '../components/Text';
import { VerifierMetricsBar } from '../components/VerifierMetricsBar';
import { computeVerifierMetrics } from '../utils/verifierMetrics';
import { useVerifierStore } from '../Zustand/Store';
import { StatusChip } from '../components/StatusChip';

export default function PendingValidations() {
  const navigate = useNavigate();
  const { pendingValidations, validationHistory, batchApprove, batchReject } = useVerifierStore();

  // Queue-at-a-glance metrics for the strip above the table.
  const metrics = useMemo(
    () => computeVerifierMetrics(pendingValidations, validationHistory),
    [pendingValidations, validationHistory],
  );

  // Optional: Simple state to handle sorting by days remaining
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Multi-select state for batch actions.
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<'approve' | 'reject'>('approve');
  const selectAllRef = useRef<HTMLInputElement>(null);

  const sortedValidations = useMemo(
    () =>
      [...pendingValidations].sort((a, b) =>
        sortOrder === 'asc'
          ? a.daysRemaining - b.daysRemaining
          : b.daysRemaining - a.daysRemaining,
      ),
    [pendingValidations, sortOrder],
  );

  // Keep selection in sync with the queue: drop ids that are no longer pending.
  useEffect(() => {
    setSelectedIds((prev) => {
      const next = prev.filter((id) => pendingValidations.some((t) => t.id === id));
      return next.length === prev.length ? prev : next;
    });
  }, [pendingValidations]);

  const allIds = sortedValidations.map((t) => t.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const someSelected = selectedIds.length > 0 && !allSelected;

  // Native checkboxes expose "indeterminate" only via the DOM property.
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : allIds);
  };

  const openBatch = (decision: 'approve' | 'reject') => {
    if (selectedIds.length === 0) return;
    setPendingDecision(decision);
    setModalOpen(true);
  };

  const handleConfirm = (decision: 'approve' | 'reject', notes: string) => {
    if (decision === 'approve') {
      batchApprove(selectedIds, notes);
    } else {
      batchReject(selectedIds, notes);
    }
    setSelectedIds([]);
    setModalOpen(false);
  };

  const hasSelection = selectedIds.length > 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <button
            onClick={() => navigate('/verifier')}
            className="mb-2 text-sm font-medium transition"
            style={{ color: 'var(--muted)' }}
          >
            &larr; Back to Dashboard
          </button>
          <Text role="display" as="h1">Pending Validations</Text>
          <Text role="body" as="p" className="mt-1" style={{ color: 'var(--muted)' }}>
            Review and validate milestones submitted by vault owners.
          </Text>
        </div>

        <button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="px-4 py-2 border rounded text-sm font-medium transition"
          style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--bg)' }}
        >
          Sort by Urgency: {sortOrder === 'asc' ? 'High to Low' : 'Low to High'}
        </button>
      </header>

      <VerifierMetricsBar metrics={metrics} />

      <section className="border rounded-lg shadow-sm overflow-x-auto" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
        {sortedValidations.length === 0 ? (
          <div className="p-12 text-center" style={{ color: 'var(--muted)' }}>
            <Text role="body" as="h3">All caught up!</Text>
            <Text role="body" as="p" className="mt-2">There are no pending validations in your queue.</Text>
          </div>
        ) : (
          <table className="w-full text-left border-collapse" aria-label="Pending Validations">
            <thead>
              <tr className="border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <th scope="col" className="p-4 w-12">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    aria-label="Select all validations"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 cursor-pointer accent-blue-600"
                  />
                </th>
                <th scope="col" className="p-4 font-medium text-sm" style={{ color: 'var(--muted)' }}>Vault & Milestone</th>
                <th scope="col" className="p-4 font-medium text-sm" style={{ color: 'var(--muted)' }}>Owner</th>
                <th scope="col" className="p-4 font-medium text-sm" style={{ color: 'var(--muted)' }}>Amount at Stake</th>
                <th scope="col" className="p-4 font-medium text-sm" style={{ color: 'var(--muted)' }} aria-sort={sortOrder === 'asc' ? 'ascending' : 'descending'}>Deadline</th>
                <th scope="col" className="p-4 font-medium text-sm text-right" style={{ color: 'var(--muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedValidations.map((task) => {
                const checked = selectedIds.includes(task.id);
                return (
                  <tr
                    key={task.id}
                    className="border-b transition"
                    style={{ borderColor: 'var(--border)', background: checked ? 'var(--accent-transparent)' : undefined }}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        aria-label={`Select ${task.vaultName}`}
                        checked={checked}
                        onChange={() => toggleOne(task.id)}
                        className="h-4 w-4 cursor-pointer accent-blue-600"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Text role="body" as="p" className="font-semibold" style={{ color: 'var(--text)' }}>{task.vaultName}</Text>
                        <StatusChip status="pending_validation" size="sm" />
                      </div>
                      <Text role="body" as="p" className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{task.milestone}</Text>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 rounded font-mono" style={{ background: 'var(--surface-raised)', color: 'var(--text)' }}>
                        {task.owner}
                      </span>
                    </td>
                    <td className="p-4">
                      <Text role="body" as="p" className="font-medium" style={{ color: 'var(--text)' }}>{task.amount}</Text>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <Text role="body" as="p" className="text-sm">{task.deadline}</Text>
                        <span className={`text-sm font-medium ${task.daysRemaining <= 3 ? 'text-red-600' : 'text-green-600'}`}>
                          {task.daysRemaining} days left
                        </span>
                        {task.daysRemaining <= 3 && (
                          <span className="sr-only">Urgent</span>
                        )}
                        <CountdownDeadline deadline={task.deadline} />
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate(`/verifier/queue/${task.id}`)}
                        className="px-4 py-2 rounded transition text-sm font-medium"
                        style={{ background: 'var(--accent-transparent)', color: 'var(--accent)' }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Sticky batch action bar */}
      <div
        role="region"
        aria-label="Batch actions"
        className="sticky bottom-4 mx-auto w-full max-w-2xl rounded-lg border px-4 py-3 shadow-lg flex items-center justify-between gap-4"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
      >
        <Text role="body" as="span" className="text-sm" style={{ color: 'var(--muted)' }}>
          {selectedIds.length} selected
        </Text>
        <div className="flex gap-3">
          <button
            onClick={() => openBatch('reject')}
            disabled={!hasSelection}
            className="px-4 py-2 text-sm font-medium rounded bg-red-50 text-red-700 hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Reject Selected
          </button>
          <button
            onClick={() => openBatch('approve')}
            disabled={!hasSelection}
            className="px-4 py-2 text-sm font-bold rounded bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Approve Selected
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        initialDecision={pendingDecision}
        affectedCount={selectedIds.length}
      />
    </div>
  );
}
