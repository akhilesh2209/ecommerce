"use client";

import { useState } from "react";
import API from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setIsSubmitting(true);
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registered Successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="p-6 border rounded-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          onChange={(e) => setName(e.target.value)}
        />

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
          onClick={handleRegister}
          disabled={isSubmitting}
          className={`w-full bg-black text-white p-2 rounded ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}