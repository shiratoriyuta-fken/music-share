// app/posts/[id]/PostPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getPostById } from "@/lib/posts";
import { useRouter } from "next/navigation";

export default function PostPageClient({ id }: { id: string }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 投稿データの取得
    async function fetchPost() {
      const postData = await getPostById(id);
      setPost(postData);
      setLoading(false);
    }

    // 現在のユーザーを取得
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    fetchPost();
    fetchUser();

    // リアルタイムサブスクリプションの設定
    const commentsSubscription = supabase
      .channel("comments-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${id}`,
        },
        async (payload) => {
          // 新しいコメントが追加されたら投稿データを再取得
          const updatedPost = await getPostById(id);
          setPost(updatedPost);
        }
      )
      .subscribe();

    // クリーンアップ関数
    return () => {
      supabase.removeChannel(commentsSubscription);
    };
  }, [id]);

  // コメント投稿処理
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim() || !user) {
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("comments")
        .insert([
          {
            content: commentText,
            user_id: user.id,
            post_id: id,
          },
        ]);

      if (error) {
        throw error;
      }

      setCommentText("");
    } catch (error) {
      console.error("コメント投稿エラー:", error);
      alert("コメントの投稿に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  // いいね処理
  const handleLike = async () => {
    if (!user) {
      router.push("/auth");
      return;
    }

    try {
      // すでにいいねしているか確認
      const { data: existingLike } = await supabase
        .from("likes")
        .select()
        .eq("user_id", user.id)
        .eq("post_id", id)
        .single();

      if (existingLike) {
        // いいねを削除
        await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", id);
      } else {
        // いいねを追加
        await supabase.from("likes").insert([{ user_id: user.id, post_id: id }]);
      }

      // 投稿データを再取得
      const updatedPost = await getPostById(id);
      setPost(updatedPost);
    } catch (error) {
      console.error("いいね処理エラー:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">読み込み中...</div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        投稿が見つかりませんでした
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/posts" className="text-primary hover:underline mb-4 inline-block">
          ← 投稿一覧に戻る
        </Link>
        <h1 className="text-3xl font-bold mt-2">{post.title}</h1>
        <div className="flex items-center mt-4">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage
              src={post.users?.image || "/placeholder.svg?height=40&width=40"}
              alt={post.users?.name}
            />
            <AvatarFallback>{post.users?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <Link
              href={`/users/${post.user_id}`}
              className="font-medium hover:text-primary transition-colors"
            >
              {post.users?.name || "不明なユーザー"}
            </Link>
            <p className="text-sm text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString("ja-JP")}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        {post.embed_url && (
          <div className="aspect-video bg-muted rounded-md mb-6 overflow-hidden">
            <iframe
              src={post.embed_url.replace("watch?v=", "embed/")}
              className="w-full h-full"
              title={post.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {post.post_tags?.map((postTag: any) => (
            <Link key={postTag.tags.id} href={`/tags/${postTag.tags.name}`}>
              <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
                {postTag.tags.name}
              </Badge>
            </Link>
          ))}
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          {post.content.split("\n").map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {(post.artist || post.song) && (
          <div className="mt-6 bg-muted/30 p-4 rounded-md">
            <h3 className="font-medium mb-2">曲情報</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {post.artist && (
                <>
                  <div>アーティスト:</div>
                  <div>{post.artist}</div>
                </>
              )}
              {post.song && (
                <>
                  <div>曲名:</div>
                  <div>{post.song}</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleLike}
          >
            <Heart
              size={18}
              className={
                user && post.likes?.some((like: any) => like.user_id === user.id)
                  ? "fill-primary text-primary"
                  : ""
              }
            />
            <span>{post.likes?.length || 0}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare size={18} />
            <span>{post.comments?.length || 0}</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Share2 size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <Bookmark size={18} />
          </Button>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          コメント ({post.comments?.length || 0})
        </h2>
        <div className="space-y-6">
          {post.comments?.map((comment: any) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={comment.users?.image || "/placeholder.svg?height=30&width=30"}
                  alt={comment.users?.name}
                />
                <AvatarFallback>{comment.users?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <Link
                      href={`/users/${comment.user_id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {comment.users?.name || "不明なユーザー"}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">コメントを投稿</h3>
        {user ? (
          <form onSubmit={handleSubmitComment}>
            <Textarea
              placeholder="コメントを入力してください..."
              className="mb-3"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={submitting}
            />
            <Button type="submit" disabled={submitting || !commentText.trim()}>
              {submitting ? "投稿中..." : "投稿する"}
            </Button>
          </form>
        ) : (
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <p className="mb-2">コメントを投稿するにはログインが必要です</p>
            <Button asChild>
              <Link href="/auth">ログイン / 新規登録</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
