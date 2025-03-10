import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react"

export default function PostPage({ params }: { params: { id: string } }) {
  // 実際の実装では、ここでデータをフェッチします
  const post = {
    id: params.id,
    title: "King Gnuの新アルバム「CEREMONY」レビュー",
    author: "音楽マニア",
    authorId: "101",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023年12月10日",
    content: `
      <p>King Gnuの最新アルバム「CEREMONY」は、バンドの音楽的成長を感じさせる作品です。</p>
      <p>特に「白日」は、メロディアスなピアノの導入から始まり、常田大希の特徴的なボーカルが楽曲全体を引き立てています。歌詞の深さと音楽的な複雑さが見事に調和しており、聴くたびに新しい発見があります。</p>
      <p>また、「三文小説」のような実験的な楽曲も収録されており、バンドの多様性を示しています。ロックの要素とポップなメロディの融合は、King Gnuの真骨頂と言えるでしょう。</p>
      <p>全体として、このアルバムは日本の音楽シーンに新しい風を吹き込む素晴らしい作品です。</p>
    `,
    embedUrl: "https://www.youtube.com/embed/ony539T074w",
    tags: ["J-Pop", "ロック", "King Gnu", "アルバムレビュー"],
    likes: 124,
    comments: [
      {
        id: "1",
        author: "音楽好き",
        authorId: "201",
        authorAvatar: "/placeholder.svg?height=30&width=30",
        content: "素晴らしいレビューですね！私も「白日」が特に好きです。",
        date: "2023年12月11日",
        likes: 5,
      },
      {
        id: "2",
        author: "ロック専門",
        authorId: "202",
        authorAvatar: "/placeholder.svg?height=30&width=30",
        content: "King Gnuは本当に革新的なバンドだと思います。常田さんの音楽センスは素晴らしい。",
        date: "2023年12月12日",
        likes: 3,
      },
    ],
    artist: "King Gnu",
    album: "CEREMONY",
    releaseYear: "2020",
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
            <AvatarImage src={post.authorAvatar} alt={post.author} />
            <AvatarFallback>{post.author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/users/${post.authorId}`} className="font-medium hover:text-primary transition-colors">
              {post.author}
            </Link>
            <p className="text-sm text-muted-foreground">{post.date}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="aspect-video bg-muted rounded-md mb-6 overflow-hidden">
          <iframe
            src={post.embedUrl}
            className="w-full h-full"
            title={post.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/tags/${tag}`}>
              <Badge variant="secondary" className="hover:bg-secondary/80 transition-colors">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>

        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>

        <div className="mt-6 bg-muted/30 p-4 rounded-md">
          <h3 className="font-medium mb-2">曲情報</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>アーティスト:</div>
            <div>{post.artist}</div>
            <div>アルバム:</div>
            <div>{post.album}</div>
            <div>リリース年:</div>
            <div>{post.releaseYear}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Heart size={18} />
            <span>{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare size={18} />
            <span>{post.comments.length}</span>
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
        <h2 className="text-xl font-bold mb-4">コメント ({post.comments.length})</h2>
        <div className="space-y-6">
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                <AvatarFallback>{comment.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <Link
                      href={`/users/${comment.authorId}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {comment.author}
                    </Link>
                    <span className="text-xs text-muted-foreground">{comment.date}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
                <div className="flex items-center mt-1 ml-1">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <Heart size={14} className="mr-1" />
                    <span>{comment.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    返信
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">コメントを投稿</h3>
        <Textarea placeholder="コメントを入力してください..." className="mb-3" rows={3} />
        <Button>投稿する</Button>
      </div>
    </div>
  )
}

