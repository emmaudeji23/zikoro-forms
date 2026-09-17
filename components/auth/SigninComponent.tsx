// app/(auth)/signin/page.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { requestOtp, signInWithPassword } from "@/services/auth/actions"
import { LineInput } from "../shared/LineInput"

type Mode = "passwordless" | "password"

export default function SignInComponent() {
  const [mode, setMode] = React.useState<Mode>("passwordless")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string>()

  // Switching mode shows a different form entirely — a leftover error from
  // the other panel would be confusing sitting there, so clear it.
  const switchMode = (next: Mode) => {
    setMode(next)
    setError(undefined)
  }

  // Any edit invalidates a previous error — clear it as soon as the person
  // starts correcting their input, rather than leaving it stuck until the
  // next submit attempt.
  const updateEmail = (value: string) => {
    setEmail(value)
    if (error) setError(undefined)
  }

  const updatePassword = (value: string) => {
    setPassword(value)
    if (error) setError(undefined)
  }

  const handlePasswordless = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    setPending(true)
    const { success, error: reqError, redirectTo } = await requestOtp(email, "signin")
    setPending(false)

    if (redirectTo) {
      // The action already encoded the right toast message into this URL —
      // this component doesn't need to know what happened, just where to go.
      window.location.href = redirectTo
      return
    }

    // Failure with nowhere to redirect to — the user stays right here, so
    // keep the reason visible inline until they change something, instead
    // of a toast that fades on its own and leaves them guessing what to fix.
    setError(reqError || "Something went wrong. Please try again.")
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    setPending(true)
    const result = await signInWithPassword(email, password)
    setPending(false)

    if (result?.redirectTo) {
      // The action already encoded the right toast message into this URL —
      // this component doesn't need to know what happened, just where to go.
      window.location.href = result?.redirectTo
      return
    }

    // On success, signInWithPassword redirects server-side (see the
    // action) — there's nothing to handle here in that case. Only a
    // failure result reaches this point.
    if (!result?.success) {
      setError(result?.error || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col justify-center py-12">
      <div className="shrink-0 space-y-1.5">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">How do you want to sign in?</p>
      </div>

      {/* segmented toggle with sliding indicator */}
      <div className="relative my-6 grid h-11 shrink-0 grid-cols-2 rounded-full border p-0.5">
        <div
          className={cn(
            "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-primary transition-transform duration-300 ease-out",
            mode === "password" && "translate-x-full"
          )}
        />

        <button
          type="button"
          onClick={() => switchMode("passwordless")}
          aria-pressed={mode === "passwordless"}
          className={cn(
            "relative z-10 rounded-full px-3 text-sm font-medium transition-colors",
            mode === "passwordless" ? "text-primary-foreground" : "text-muted-foreground"
          )}
        >
          Passwordless
        </button>

        <button
          type="button"
          onClick={() => switchMode("password")}
          aria-pressed={mode === "password"}
          className={cn(
            "relative z-10 rounded-full px-3 text-sm font-medium transition-colors",
            mode === "password" ? "text-primary-foreground" : "text-muted-foreground"
          )}
        >
          Password
        </button>
      </div>

      {/* sliding content panel */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className="flex w-[200%] transition-transform duration-300 ease-out"
          style={{ transform: mode === "password" ? "translateX(-50%)" : "translateX(0%)" }}
        >
          {/* Passwordless panel */}
          <form onSubmit={handlePasswordless} className="w-1/2 shrink-0 space-y-6 pr-1">
            <LineInput
              label="Email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
            />
            <div>
              <Button type="submit" className="h-11 w-full" disabled={pending}>
                Continue with email
              </Button>
              {mode === "passwordless" && error && (
                <small role="alert" className="mt-2 block text-xs text-destructive">
                  {error}
                </small>
              )}
            </div>
          </form>

          {/* Password panel */}
          <form onSubmit={handlePassword} className="w-1/2 shrink-0 space-y-6 pl-1">
            <LineInput
              label="Email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
            />

            <LineInput
              label="Password"
              type="password"
              name="password"
              placeholder="Your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => updatePassword(e.target.value)}
              forgotPassword
              required
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Haven't set a password? Add one from profile settings.</span>
            </div>
            <div>
              <Button type="submit" className="h-11 w-full" disabled={pending}>
                Sign in
              </Button>
              {mode === "password" && error && (
                <small role="alert" className="mt-2 block text-xs text-destructive">
                  {error}
                </small>
              )}
            </div>
          </form>
        </div>
      </div>

      <p className="shrink-0 pt-3 text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary underline-offset-4 hover:text-primary hover:underline"
        >
          Get started
        </Link>
      </p>
    </div>
  )
}