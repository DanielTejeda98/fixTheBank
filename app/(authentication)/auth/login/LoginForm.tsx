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
import { EyeClosed, EyeIcon, TriangleAlert } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import z from "zod";

const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  redirect: z.boolean(),
});

export default function LoginForm() {
  const router = useRouter();
  const [credError, setCredError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const params = useSearchParams();
  const redirect = params?.get("callbackUrl")?.toString();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      redirect: false,
    },
    validators: {
      onChange: loginFormSchema,
    },
    onSubmit: async (values) => {
      const res = await signIn("credentials", values.value);
      if (!res) {
        setCredError("An unexpected error occurred. Please try again.");
        return;
      }

      if (res?.status === 401) {
        setCredError(
          "Invalid username or password. Please check your credentials and try again.",
        );
        return;
      }

      if (res?.error) {
        setCredError(res.error);
        return;
      }

      if (res?.status !== 200) {
        // Handle non-successful response
        setCredError("An unexpected error occurred. Please try again.");
        return;
      }

      router.push(redirect || "/dashboard");
    },
  });
  return (
    <div className="w-full h-svh flex items-center justify-center">
      <Card className="mx-2 lg:max-w-1/3">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Please enter your credentials, or use a provider to access your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="pb-4">
            <ErrorAlert message={credError} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-4">
              <form.Field
                name="username"
                children={(field) => (
                  <Field>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      placeholder="Enter your username"
                      onChange={(e) => field.handleChange(e.target.value)}
                      id="username"
                    />
                  </Field>
                )}
              />
              <form.Field
                name="password"
                children={(field) => (
                  <Field>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={(e) => field.handleChange(e.target.value)}
                        id="password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeIcon /> : <EyeClosed />}
                      </Button>
                    </div>
                  </Field>
                )}
              />
              <div className="flex justify-end">
                <form.Subscribe
                  selector={(state) => [state.isSubmitting]}
                  children={([isSubmitting]) => (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                  )}
                />
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-center text-muted-foreground"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorAlert({ message }: { message: string }) {
  if (!message) return null;
  return (
    <Alert variant={"destructive"}>
      <TriangleAlert />
      <AlertTitle>Login unsuccessful</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
