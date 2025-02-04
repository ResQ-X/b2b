"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthService } from "@/services/auth.service"
import type { AuthState } from "@/types/auth"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [token, setToken] = useState("")
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setAuthState({ isLoading: true, error: null })

    try {
      const response = await AuthService.verifyEmail({ email, token })
      if (response.success) {
        router.push("/login")
      }
    } catch (error: any) {
      setAuthState({
        isLoading: false,
        error: error.response?.data?.message || "Invalid verification code",
      })
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="flex flex-col items-center">
          <div className="w-[181px] h-[70px] relative mb-8">
            <Image src="/ressqx.png" alt="RESQ-X Logo" fill className="object-cover" priority />
          </div>

          <h1 className="text-3xl font-semibold text-center mb-2">Verify Your Email</h1>
          <p className="text-center text-gray-500 mb-8">Please enter the verification code sent to {email}</p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <Input
              className="w-full bg-orange bg-opacity-5 focus:ring-none focus:outline-none focus:border-orange h-[60px] rounded-[10px] border border-beige text-center text-2xl tracking-widest"
              type="text"
              maxLength={6}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="000000"
            />

            {authState.error && <p className="text-sm text-red-500 text-center">{authState.error}</p>}

            <Button
              type="submit"
              className="w-full h-[60px] bg-orange hover:bg-opacity-80 hover:scale-105 transition-all hover:bg-orange duration-200"
              disabled={authState.isLoading || token.length !== 6}
            >
              {authState.isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

