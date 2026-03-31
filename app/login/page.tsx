"use client";

import { useState } from "react";
import API from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/app-state-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      await login(res.data.token, res.data._id);

      toast.success("Login Successful");
      router.push("/");
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="p-6 border rounded-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={isSubmitting}
          className={`w-full bg-black text-white p-2 rounded ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}