"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';
import { uploadImage } from "@/lib/storage";
import { createPost } from "@/lib/posts";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewPostPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    song: "",
    embedUrl: "",
    content: "",
    genre: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleAddTag = () => {
    if (tagInput && !selectedTags.includes(tagInput)) {
      setSelectedTags([...selectedTags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, genre: value });
    if (value && !selectedTags.includes(value)) {
      setSelectedTags([...selectedTags, value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 現在のユーザーを取得
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("ログインが必要です");
      }

      let coverImageUrl = "";

      // 画像がアップロードされている場合
      if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
        coverImageUrl = await uploadImage(fileInputRef.current.files[0]);
      }

      // 投稿を作成
      await createPost({
        title: formData.title,
        content: formData.content,
        userId: user.id,
        artist: formData.artist,
        song: formData.song,
        embedUrl: formData.embedUrl,
        coverImage: coverImageUrl,
        tags: selectedTags,
      });

      // 投稿一覧ページにリダイレクト
      router.push("/posts");
      router.refresh();
    } catch (error) {
      console.error("投稿作成エラー:", error);
      alert("投稿の作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/posts" className="text-primary hover:underline mb-4 inline-block">
        ← 投稿一覧に戻る
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">新規投稿を作成</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">タイトル</Label>
                <Input 
                  id="title" 
                  placeholder="投稿のタイトルを入力してください" 
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="artist">アーティスト名</Label>
                  <Input 
                    id="artist" 
                    placeholder="アーティスト名を入力" 
                    value={formData.artist}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="song">曲名</Label>
                  <Input 
                    id="song" 
                    placeholder="曲名を入力" 
                    value={formData.song}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="embedUrl">埋め込みリンク（YouTube/Spotify）</Label>
                <Input 
                  id="embedUrl" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  value={formData.embedUrl}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-muted-foreground">YouTubeやSpotifyの共有リンクを貼り付けてください</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">レビュー内容</Label>
                <Textarea 
                  id="content" 
                  placeholder="音楽についての感想や分析を書いてください" 
                  rows={8} 
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>ジャンル</Label>
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="ジャンルを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpop">J-Pop</SelectItem>
                    <SelectItem value="rock">ロック</SelectItem>
                    <SelectItem value="hiphop">ヒップホップ</SelectItem>
                    <SelectItem value="rnb">R&B</SelectItem>
                    <SelectItem value="classical">クラシック</SelectItem>
                    <SelectItem value="jazz">ジャズ</SelectItem>
                    <SelectItem value="electronic">エレクトロニック</SelectItem>
                    <SelectItem value="folk">フォーク</SelectItem>
                    <SelectItem value="metal">メタル</SelectItem>
                    <SelectItem value="indie">インディー</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">タグ</Label>
                <div className="flex gap-2">
                  <Input 
                    id="tags" 
                    placeholder="タグを入力して Enter" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button type="button" onClick={handleAddTag}>追加</Button>
                </div>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button 
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                          type="button"
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover">カバー画像</Label>
                <Input id="cover" type="file" accept="image/*" ref={fileInputRef} />
              </div>
            </div>

            <CardFooter className="flex justify-between gap-2 px-0 pt-6">
              <Button variant="outline" type="button" asChild>
                <Link href="/posts">キャンセル</Link>
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "投稿中..." : "投稿する"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}