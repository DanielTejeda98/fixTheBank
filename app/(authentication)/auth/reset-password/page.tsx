"use client";

import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Field } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import z from "zod";

const resetPasswordFormSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
  });

export default function ResetPassword() {
  const params = useSearchParams();
  const [successAlertMsg, setSuccessAlertMsg] = useState("");
  const form = useForm({
    defaultValues: {
      token: params.get("token") || "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validators: {
      onChange: resetPasswordFormSchema,
    },
    onSubmit: async (values) => {
      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values.value),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessAlertMsg(data.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });
  return (
    <div className="w-full h-svh flex items-center justify-center">
      <Card className="mx-2 lg:max-w-1/3">
        <CardHeader>
          <CardTitle className="text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Fill out the form to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="pb-4">
            <SuccessAlert message={successAlertMsg} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-4">
              <form.Field
                name="newPassword"
                children={(field) => (
                  <Field>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      onChange={(e) => field.handleChange(e.target.value)}
                      id="newPassword"
                    />
                  </Field>
                )}
              />
              <form.Field
                name="confirmNewPassword"
                children={(field) => (
                  <Field>
                    <Label htmlFor="confirmNewPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                      onChange={(e) => field.handleChange(e.target.value)}
                      id="confirmNewPassword"
                    />
                  </Field>
                )}
              />
              <div className="flex justify-end">
                <form.Subscribe
                  selector={(state) => [state.isSubmitting]}
                  children={([isSubmitting]) => (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Resetting password..."
                        : "Reset Password"}
                    </Button>
                  )}
                />
              </div>
              <Link
                href="/auth/login"
                className="text-sm text-center text-muted-foreground"
              >
                Looking to log in?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SuccessAlert({ message }: { message: string }) {
  if (!message) return null;
  return (
    <Alert variant={"default"}>
      <CheckCircle2 />
      <AlertTitle>Password reset requested</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
