"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export default function NewPostPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const handleAddTag = () => {
    if (tagInput && !selectedTags.includes(tagInput)) {
      setSelectedTags([...selectedTags, tagInput])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

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
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input id="title" placeholder="投稿のタイトルを入力してください" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="artist">アーティスト名</Label>
              <Input id="artist" placeholder="アーティスト名を入力" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="song">曲名</Label>
              <Input id="song" placeholder="曲名を入力" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="embed">埋め込みリンク（YouTube/Spotify）</Label>
            <Input id="embed" placeholder="https://www.youtube.com/watch?v=..." />
            <p className="text-sm text-muted-foreground">YouTubeやSpotifyの共有リンクを貼り付けてください</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">レビュー内容</Label>
            <Textarea id="content" placeholder="音楽についての感想や分析を書いてください" rows={8} />
          </div>

          <div className="space-y-2">
            <Label>ジャンル</Label>
            <Select>
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
              <Button type="button" onClick={handleAddTag}>
                追加
              </Button>
            </div>
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">カバー画像</Label>
            <Input id="cover" type="file" accept="image/*" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/posts">キャンセル</Link>
          </Button>
          <Button>投稿する</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

