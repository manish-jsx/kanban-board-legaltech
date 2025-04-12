import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F5F7] p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
