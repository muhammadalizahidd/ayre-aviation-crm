import { statusItems } from '@/bll/status/statusLine';
import { StatusLine } from '@/ui/primitives';

/** Page header (DESIGN.md 5.3): one H1, one-line subtitle, the honesty status line. */
export function PageHeader({
  title,
  subtitle,
  refreshedLabel,
}: {
  title: string;
  subtitle: string;
  refreshedLabel?: string;
}) {
  return (
    <header className="mb-[22px]">
      <h1 className="font-serif text-[28px] font-bold leading-[1.15]">{title}</h1>
      <p className="mt-1 text-fg-secondary">{subtitle}</p>
      <StatusLine items={statusItems(refreshedLabel)} />
    </header>
  );
}
