"use client";

import { Button } from "@repo/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/field";
import { Separator } from "@repo/ui/components/separator";
import { Input } from "@repo/ui/components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(16, "Password must be at least 16 characters long")
    .regex(/\d/, "Password must contain at least one number"),
});

type RegisterType = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterType) => {
    // form
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4 gap-y-2"
    >
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
          Your password must be 16 characters long and contain at least one
          number.
        </FieldDescription>
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </Field>
      <Button type="submit" className="mt-1 mb-1">
        Continue
      </Button>
      <Separator />
      <div className="flex flex-col space-y-2 mt-1 w-full">
        <Button disabled={isSubmitting} type="submit" variant={"outline"}>
          Continue with Google
        </Button>
      </div>
    </form>
  );
}

export { registerSchema, type RegisterType };
