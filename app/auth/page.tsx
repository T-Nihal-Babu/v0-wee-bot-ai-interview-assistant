"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { registerUser, loginUser } from "@/lib/auth"
import { Brain, Briefcase } from "lucide-react"

type AuthMode = "login" | "signup"
type UserType = "candidate" | "company"

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("login")
  const [userType, setUserType] = useState<UserType>("candidate")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    company: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (mode === "signup") {
        const result = registerUser(
          formData.username,
          formData.email,
          formData.password,
          userType,
          userType === "company" ? formData.company : undefined,
        )
        if (!result.success) {
          setError(result.error || "Signup failed")
          setLoading(false)
          return
        }
      } else {
        const result = loginUser(formData.email, formData.password)
        if (!result.success) {
          setError(result.error || "Login failed")
          setLoading(false)
          return
        }
      }

      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Brain className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                WeeBot
              </h1>
            </div>
            <p className="text-muted-foreground">AI-powered interview assistant</p>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>{mode === "login" ? "Welcome Back" : "Create Account"}</CardTitle>
              <CardDescription>
                {mode === "login" ? "Sign in to continue your interview prep" : "Choose your role to get started"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mode === "signup" && (
                <Tabs value={userType} onValueChange={(value: any) => setUserType(value)} className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="candidate" className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Practice
                    </TabsTrigger>
                    <TabsTrigger value="company" className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Hiring
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Username</label>
                    <Input
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="bg-input border-border"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-input border-border"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Password</label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-input border-border"
                  />
                </div>

                {mode === "signup" && userType === "company" && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Company Name</label>
                    <Input
                      name="company"
                      placeholder="Enter your company name"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="bg-input border-border"
                    />
                  </div>
                )}

                {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</div>}

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={loading}>
                  {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                {mode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => {
                        setMode("signup")
                        setError("")
                      }}
                      className="text-accent hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setMode("login")
                        setError("")
                      }}
                      className="text-accent hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
