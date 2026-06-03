import AuthLayout from "@/components/auth/AuthLayout";

export const dynamic = 'force-dynamic';

export default function Page() {
  return <AuthLayout initialMode="signin" />;
}