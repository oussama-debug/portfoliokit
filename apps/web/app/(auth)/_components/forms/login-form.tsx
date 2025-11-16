"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth/auth-client";
import { useState, useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, "Password is required"),
});

type LoginType = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginType) => {
    const result = await signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/scheduled",
    });

    if (result?.error) {
      return;
    }

    router.push("/scheduled");
  };

  const handleGoogleSignIn = async () => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-start gap-2">
        <Label htmlFor={emailId}>Email</Label>
        <Input
          id={emailId}
          type="email"
          placeholder="you@example.com"
          aria-label="Email"
          autoFocus
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col items-start gap-2">
        <Label htmlFor={passwordId}>Password</Label>
        <Input
          id={passwordId}
          type="password"
          placeholder="••••••••"
          aria-label="Password"
          {...register("password")}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? "Signing in..." : "Continue"}
      </Button>

      <Separator />

      <div className="flex flex-col space-y-2 w-full">
        <Button
          disabled={isSubmitting}
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </Button>
      </div>
    </form>
  );
}
