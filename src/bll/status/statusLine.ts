export interface StatusItem {
  id: string;
  label: string;
  /** `ok` = green dot, `warn` = amber dot, `plain` = no dot. */
  level: 'ok' | 'warn' | 'plain';
}

/**
 * The honesty line shown under every page title (PRD 15.1, DESIGN.md 5.3).
 * Wording follows the PRD labels. Integrations are never shown as connected in this phase.
 */
export function statusItems(refreshedLabel?: string): StatusItem[] {
  const items: StatusItem[] = [
    { id: 'demo', label: 'DEMO DATA', level: 'warn' },
    { id: 'mock', label: 'MOCK MODE', level: 'warn' },
    { id: 'avinode', label: 'Avinode NOT CONNECTED', level: 'warn' },
    { id: 'paynode', label: 'Paynode NOT CONNECTED', level: 'warn' },
  ];
  if (refreshedLabel) items.push({ id: 'refreshed', label: refreshedLabel, level: 'plain' });
  return items;
}
