import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F5F7] p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}
