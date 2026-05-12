"use client";

import * as React from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState<string | null>(null);

  return (
    <div className="space-y-8 rounded-3xl border border-white/10 bg-black/70 p-8">
      <Button
        variant="glow"
        className="w-full"
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/admin" })}
      >
        Continue with Google
      </Button>

      <div className="space-y-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
        />

        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          value={password}
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button
          type="button"
          variant="muted"
          className="w-full"
          onClick={async () => {
            setMessage(null);
            const result = await signIn("credentials", {
              email,
              password,
              redirect: false,
            });
            if (result?.error) {
              setMessage("Unable to authenticate with those credentials.");
            } else {
              window.location.href = "/admin";
            }
          }}
        >
          Credential login
        </Button>
        {message ? <p className="text-sm text-rose-400">{message}</p> : null}
      </div>
    </div>
  );
}
