import { ModulePending } from '@/features/shell/ModulePending';

/**
 * Every module route other than the dashboard lands here in this phase.
 * The screens for modules 02 to 17 are built in later phases (docs/IMPLEMENTATION_PLAN.md).
 */
export default function ModulePage() {
  return <ModulePending />;
}
