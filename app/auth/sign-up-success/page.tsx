import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Video } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary">
              <Video className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Clueso</span>
          </div>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                  <Mail className="size-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription className="text-base">
                {
                  "We've sent you a confirmation link. Please check your inbox and click the link to activate your account."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground text-center">
                  <p>{"Didn't receive the email? Check your spam folder or"}</p>
                </div>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/auth/login">Return to login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
