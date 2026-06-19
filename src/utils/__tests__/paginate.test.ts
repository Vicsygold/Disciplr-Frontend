import { describe, expect, it } from 'vitest';
import type { ValidationTask } from '../../Zustand/Store';
import { filterValidationHistory, paginate } from '../paginate';

const history: ValidationTask[] = [
  {
    id: 'v-1',
    vaultName: 'Alpha Vault',
    owner: 'GBVZ...QK7L',
    amount: '1,000 USDC',
    deadline: '2026-01-01',
    daysRemaining: 0,
    status: 'approved',
    milestone: 'Launch',
  },
  {
    id: 'v-2',
    vaultName: 'Beta Reserve',
    owner: 'GFAIL...QK7L',
    amount: '2,000 USDC',
    deadline: '2026-01-02',
    daysRemaining: 0,
    status: 'rejected',
    milestone: 'Audit',
  },
  {
    id: 'v-3',
    vaultName: 'Gamma Fund',
    owner: 'GSUCC...QK7L',
    amount: '3,000 USDC',
    deadline: '2026-01-03',
    daysRemaining: 0,
    status: 'approved',
    milestone: 'Delivery',
  },
];

describe('filterValidationHistory', () => {
  it('filters by approved or rejected status', () => {
    expect(filterValidationHistory(history, { status: 'approved', query: '' }).map((t) => t.id)).toEqual([
      'v-1',
      'v-3',
    ]);
    expect(filterValidationHistory(history, { status: 'rejected', query: '' }).map((t) => t.id)).toEqual([
      'v-2',
    ]);
  });

  it('searches vault names and owners case-insensitively', () => {
    expect(filterValidationHistory(history, { status: 'all', query: 'reserve' }).map((t) => t.id)).toEqual([
      'v-2',
    ]);
    expect(filterValidationHistory(history, { status: 'all', query: 'gsucc' }).map((t) => t.id)).toEqual([
      'v-3',
    ]);
  });

  it('combines status and query filters', () => {
    expect(filterValidationHistory(history, { status: 'rejected', query: 'alpha' })).toEqual([]);
  });
});

describe('paginate', () => {
  it('returns a normalized page of items', () => {
    const result = paginate(history, 2, 2);

    expect(result.items.map((item) => item.id)).toEqual(['v-3']);
    expect(result.currentPage).toBe(2);
    expect(result.pageCount).toBe(2);
    expect(result.totalItems).toBe(3);
    expect(result.pageSize).toBe(2);
  });

  it('clamps page and page size to safe values', () => {
    expect(paginate(history, 99, 2).currentPage).toBe(2);
    expect(paginate(history, -1, 0)).toMatchObject({
      currentPage: 1,
      pageSize: 1,
      pageCount: 3,
    });
  });
});
