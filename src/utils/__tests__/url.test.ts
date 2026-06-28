import { describe, expect, it, test } from 'vitest';
import { isSafeEvidenceUrl, normalizeEvidenceUrl } from '../url';

describe('isSafeEvidenceUrl', () => {
  test('should return true for valid http URLs', () => {
    expect(isSafeEvidenceUrl('http://example.com')).toBe(true);
  });

  test('should return true for valid https URLs', () => {
    expect(isSafeEvidenceUrl('https://example.com')).toBe(true);
  });

  test('should return false for javascript: URLs', () => {
    expect(isSafeEvidenceUrl('javascript:alert(1)')).toBe(false);
  });

  test('should return false for data: URLs', () => {
    expect(isSafeEvidenceUrl('data:text/html,test')).toBe(false);
  });

  test('should return false for invalid URLs', () => {
    expect(isSafeEvidenceUrl('not-a-url')).toBe(false);
  });

  test('should handle trailing whitespace', () => {
    expect(isSafeEvidenceUrl('  https://example.com  ')).toBe(true);
  });

  test('should handle different casing for https', () => {
    expect(isSafeEvidenceUrl('HTTPS://example.com')).toBe(true);
  });
});

describe('evidence URL validation', () => {
  it('accepts http and https URLs', () => {
    expect(isSafeEvidenceUrl('https://github.com/org/repo/pull/42')).toBe(true)
    expect(isSafeEvidenceUrl('http://example.com/evidence')).toBe(true)
  })

  it('trims safe URLs before returning them', () => {
    expect(normalizeEvidenceUrl('  https://example.com/doc  ')).toBe('https://example.com/doc')
  })

  it('rejects unsafe and missing schemes', () => {
    expect(isSafeEvidenceUrl('javascript:alert(1)')).toBe(false)
    expect(isSafeEvidenceUrl('data:text/html,hello')).toBe(false)
    expect(isSafeEvidenceUrl('example.com/evidence')).toBe(false)
    expect(isSafeEvidenceUrl('')).toBe(false)
  })
})
