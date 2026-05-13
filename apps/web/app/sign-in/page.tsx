import AuthLayout from "@/components/auth/AuthLayout";
import SignInForm from "@/components/auth/SignInForm";

export default function Page() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}