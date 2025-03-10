"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const router = useRouter();

  async function onLogin(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("ログインエラー:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onRegister(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        throw error;
      }

      // 確認メールが送信されたことを通知
      alert("確認メールを送信しました。メールを確認してアカウントを有効化してください。");
    } catch (error) {
      console.error("登録エラー:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onGoogleLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Googleログインエラー:", error);
    }
  }

  async function onTwitterLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "twitter",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Twitterログインエラー:", error);
    }
  }

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">ログイン</TabsTrigger>
        <TabsTrigger value="register">新規登録</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <div className="grid gap-6">
          <form onSubmit={onLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                ログイン
              </Button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                または
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" disabled={isLoading} onClick={onGoogleLogin}>
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" type="button" disabled={isLoading} onClick={onTwitterLogin}>
              <Icons.twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="register">
        <div className="grid gap-6">
          <form onSubmit={onRegister}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">ユーザー名</Label>
                <Input
                  id="name"
                  placeholder="ユーザー名"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                アカウント作成
              </Button>
            </div>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                または
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" disabled={isLoading} onClick={onGoogleLogin}>
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" type="button" disabled={isLoading} onClick={onTwitterLogin}>
              <Icons.twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}