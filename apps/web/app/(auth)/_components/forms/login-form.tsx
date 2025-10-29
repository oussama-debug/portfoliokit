"use client";

import { Button } from "@repo/ui/components/button";
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/field";
import { Form } from "@repo/ui/components/form";
import { Separator } from "@repo/ui/components/separator";

export function LoginForm() {
  return (
    <Form>
      <Field>
        <FieldLabel>E-mail</FieldLabel>
        <FieldControl
          name="email"
          type="email"
          placeholder="john@acme.com"
          required
        />
      </Field>
      <Field>
        <FieldLabel>Password</FieldLabel>
        <FieldControl
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
        <FieldError />
      </Field>
      <Button type="submit">Continue</Button>
      <Separator />
      <div className="flex flex-col space-y-2 w-full">
        <Button variant={"outline"}>Continue with Google</Button>
      </div>
    </Form>
  );
}
