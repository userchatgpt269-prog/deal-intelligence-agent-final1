/**
 * Formats numbers in Indian Rupee format (₹)
 * e.g. 25000000 -> ₹2.50 Cr, 1500000 -> ₹15.00 L, 25000 -> ₹25,000
 */
export function formatINR(val: number, compact: boolean = false): string {
  if (val === undefined || val === null || isNaN(val)) return '₹0';

  if (compact) {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} L`;
    }
    if (val >= 1000) {
      return `₹${(val / 1000).toFixed(1)}k`;
    }
  }

  // Full Indian number formatting (lakhs & crores separation)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
