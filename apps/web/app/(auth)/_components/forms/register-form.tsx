"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import { Field, FieldDescription, FieldError } from "@repo/ui/components/field";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@repo/ui/components/input-group";
import {
  Popover,
  PopoverTrigger,
  PopoverPopup,
} from "@repo/ui/components/popover";
import { Separator } from "@repo/ui/components/separator";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationSquareIcon } from "@hugeicons/core-free-icons";

const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
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
  const [error, _setError] = useState<string | null>(null);

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

      <InputGroup>
        <InputGroupInput
          id="email"
          type="email"
          placeholder="john@acme.com"
          autoFocus
          {...register("email")}
        />
        <InputGroupAddon>
          <Label htmlFor="email-1" className="text-foreground">
            Email
          </Label>
          <Popover openOnHover>
            <PopoverTrigger
              className="ml-auto"
              render={
                <Button variant="ghost" size="icon-xs" className="-m-1" />
              }
            >
              <HugeiconsIcon
                icon={InformationSquareIcon}
                size={24}
                color="currentColor"
                strokeWidth={1.5}
              />
            </PopoverTrigger>
            <PopoverPopup tooltipStyle side="top">
              <p>We&apos;ll use this to send you notifications</p>
            </PopoverPopup>
          </Popover>
        </InputGroupAddon>
      </InputGroup>

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
