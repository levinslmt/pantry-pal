"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem("account_created") === "true") {
      sessionStorage.removeItem("account_created");
      toast.success("Account created successfully! Please sign in.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <LoginForm onSuccess={() => router.push("/dashboard")} />
    </div>
  );
}
