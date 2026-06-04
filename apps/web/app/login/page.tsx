import AuthLayout from "@/components/auth/AuthLayout";

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return <AuthLayout initialMode="signin" />;
}
