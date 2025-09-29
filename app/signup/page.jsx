import { GalleryVerticalEnd, ArrowLeft } from "lucide-react"

import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">

      <div className="bg-muted relative hidden lg:block">
        <img
          src="/login/background.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9] dark:grayscale" />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 relative">
        <div className="flex items-center justify-between">
          <a href="/" className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors">
            <ArrowLeft className="size-5" />
          </a>
          <a href="#" className="flex items-center gap-2 font-medium">
            <div
              className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
