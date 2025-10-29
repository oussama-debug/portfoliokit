"use client";

import { Button } from "@repo/ui/components/button";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldLabel,
} from "@repo/ui/components/field";
import { Form } from "@repo/ui/components/form";
import { Separator } from "@repo/ui/components/separator";

export function RegisterForm() {
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
        <FieldDescription>
          Your email will not be shared with anyone else
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Password</FieldLabel>
        <FieldControl
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
        <FieldDescription>
          Your password must be 16 characters long and contain at least one
          number.
        </FieldDescription>
      </Field>
      <Button type="submit">Continue</Button>
      <Separator />
      <div className="flex flex-col space-y-2 w-full">
        <Button variant={"outline"}>Continue with Google</Button>
      </div>
    </Form>
  );
}
