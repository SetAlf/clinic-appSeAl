"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, AlertCircle, Stethoscope } from "lucide-react"
import { login } from "@/lib/auth"
import type { UserRole } from "@/lib/types"

function getDashboardPath(role: UserRole) {
    switch (role) {
        case "doctor":
            return "/doctor/appointments"
        case "staff":
            return "/staff/appointments"
        case "patient":
        default:
            return "/patient/appointments"
    }
}

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const { user } = await login(email, password)
            const destination = getDashboardPath(user.role)
            router.push(destination)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unable to sign in. Please try again."
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (

        <div className="flex items-center justify-center min-h-screen bg-[url('/clinic-app-login-background.jpg')] bg-center bg-cover bg-no-repeat">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Stethoscope className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-4xl font-semibold mb-2">Welcome</h1>
                </div>

                <Card className= "flex justify-center shadow-md min-h-[550px] min-w-[750px]-center">
                    <CardHeader>
                        <CardTitle className="text-[21px] font-semibold flex items-center justify-center">Sign in to Access Your Clinic Account</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="flex flex-col justify-between gap-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="flex-1 space-y-4">
                                <Label className="text-2xl font-medium" htmlFor="email">Email</Label>
                                <Input className="h-16 !text-2xl placeholder:text-2xl"
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-2xl font-medium"htmlFor="password">Password</Label>
                                </div>
                <Input className="h-16 !text-2xl placeholder:text-2xl"
                    id="password"
                    type="password"
                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div className="mt-4 py-2">
                                <Button
                                    type="submit"
                                    className="text-2xl h-14 w-full"
                                    disabled={isLoading}
                                >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </div>
                    <div className="text-xl text-muted-foreground text-center">
                      New patient? <a className="text-primary hover:underline" href="/auth/signup">Create an account</a>
                    </div>
                </CardContent>
            </form>
        </Card>
    </div>
</div>
    )
}
