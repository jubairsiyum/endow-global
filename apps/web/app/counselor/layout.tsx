import { CounselorShell } from '@/components/counselor/layout/Shell'

export default function CounselorLayout({ children }: { children: React.ReactNode }) {
  return <CounselorShell>{children}</CounselorShell>
}
