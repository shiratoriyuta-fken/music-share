import type { Metadata } from "next"
import Link from "next/link"
import { UserAuthForm } from "@/components/user-auth-form"

export const metadata: Metadata = {
  title: "認証",
  description: "認証ページ",
}

export default function AuthenticationPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 text-primary">
        ← ホームに戻る
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">アカウント</h1>
          <p className="text-sm text-muted-foreground">
            メールアドレスを入力してログインするか、ソーシャルアカウントでログインしてください
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          続行することで、
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            利用規約
          </Link>{" "}
          と{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            プライバシーポリシー
          </Link>
          に同意したことになります。
        </p>
      </div>
    </div>
  )
}

