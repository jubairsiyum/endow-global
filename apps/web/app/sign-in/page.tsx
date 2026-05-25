import AuthLayout from "@/components/auth/AuthLayout";
import SignInForm from "@/components/auth/SignInForm";

type PageProps = {
  searchParams?: {
    error?: string | string[];
  };
};

function normalizeErrorCode(error?: string | string[]) {
  return Array.isArray(error) ? error[0] : error;
}

export default function Page({ searchParams }: PageProps) {
  const authError = normalizeErrorCode(searchParams?.error);

  return (
    <AuthLayout>
      <SignInForm authError={authError} />
    </AuthLayout>
  );
}