"use client";

import { Button } from "@repo/ui/components/button";
import { Field, FieldDescription, FieldError } from "@repo/ui/components/field";
import { Separator } from "@repo/ui/components/separator";
import { Input } from "@repo/ui/components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginType = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginType) => {
    const { error } = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (error) {
      return;
    }

    router.push("/scheduled");
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/scheduled" });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4 gap-y-2"
    >
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <Field>
        <Input
          type="email"
          placeholder="john@acme.com"
          autoFocus
          {...register("email")}
        />
        <FieldDescription>Enter your email address</FieldDescription>
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </Field>

      <Field>
        <Input
          type="password"
          placeholder="••••••••"
          {...register("password")}
        />
        <FieldDescription>Enter your password</FieldDescription>
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </Field>

      <Button type="submit" disabled={isSubmitting} className="mt-1 mb-1">
        {isSubmitting ? "Signing in..." : "Continue"}
      </Button>

      <Separator />

      <div className="flex flex-col space-y-2 mt-1 w-full">
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
