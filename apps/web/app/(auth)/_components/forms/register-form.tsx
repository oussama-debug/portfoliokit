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

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /(?=.*[a-zA-Z])(?=.*\d)/,
      "Password must contain at least one letter and one number"
    ),
});

type RegisterType = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterType) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/gateway/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.email,
          password: data.password,
        }),
      }
    );

    if (!response.ok) return;

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
        <FieldDescription>
          Your email will not be shared with anyone else
        </FieldDescription>
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </Field>

      <Field>
        <Input
          type="password"
          placeholder="••••••••"
          {...register("password")}
        />
        <FieldDescription>
          Your password must be at least 8 characters long and contain at least
          one letter and one number.
        </FieldDescription>
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </Field>

      <Button type="submit" disabled={isSubmitting} className="mt-1 mb-1">
        {isSubmitting ? "Creating account..." : "Continue"}
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

export { registerSchema, type RegisterType };
