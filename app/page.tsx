import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Music } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">MusicShare</h1>
          <p className="text-xl text-muted-foreground">音楽好きのための共有プラットフォーム</p>
          <div className="flex justify-center gap-4 mt-6">
            <Button asChild>
              <Link href="/posts/new">新規投稿を作成</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/discover">音楽を探す</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">人気の投稿</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Link href={`/posts/${post.id}`}>
                  <CardTitle className="hover:text-primary transition-colors">{post.title}</CardTitle>
                </Link>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Link href={`/users/${post.authorId}`} className="font-medium hover:text-primary transition-colors">
                    {post.author}
                  </Link>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                  <img
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="line-clamp-2 text-muted-foreground">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex items-center pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Music size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{post.artist}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6">
          <Button variant="outline" asChild>
            <Link href="/posts">すべての投稿を見る</Link>
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">おすすめのジャンル</h2>
        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => (
            <Link key={genre} href={`/tags/${genre}`}>
              <Badge variant="outline" className="text-base py-2 px-4 hover:bg-secondary transition-colors">
                {genre}
              </Badge>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

// ダミーデータ
const popularPosts = [
  {
    id: "1",
    title: "King Gnuの新アルバム「CEREMONY」レビュー",
    author: "音楽マニア",
    authorId: "101",
    date: "2023年12月10日",
    coverImage: "/placeholder.svg?height=200&width=400",
    excerpt: "King Gnuの最新アルバム「CEREMONY」は、バンドの音楽的成長を感じさせる作品です。特に「白日」は...",
    tags: ["J-Pop", "ロック", "King Gnu"],
    likes: 124,
    comments: 32,
    artist: "King Gnu",
  },
  {
    id: "2",
    title: "懐かしの90年代R&Bプレイリスト",
    author: "レトロ音楽ファン",
    authorId: "102",
    date: "2023年12月5日",
    coverImage: "/placeholder.svg?height=200&width=400",
    excerpt:
      "90年代のR&Bは今聴いても色褪せない魅力があります。TLCからBoyz II Menまで、当時を代表する名曲を集めました...",
    tags: ["R&B", "90年代", "プレイリスト"],
    likes: 98,
    comments: 17,
    artist: "Various Artists",
  },
  {
    id: "3",
    title: "テイラー・スウィフトの音楽的変遷",
    author: "ポップカルチャー評論家",
    authorId: "103",
    date: "2023年11月28日",
    coverImage: "/placeholder.svg?height=200&width=400",
    excerpt: "カントリーからポップへ、そして実験的なサウンドへ。テイラー・スウィフトの音楽的変遷を追います...",
    tags: ["ポップ", "テイラー・スウィフト", "分析"],
    likes: 156,
    comments: 41,
    artist: "Taylor Swift",
  },
]

const genres = [
  "J-Pop",
  "ロック",
  "ヒップホップ",
  "R&B",
  "クラシック",
  "ジャズ",
  "エレクトロニック",
  "フォーク",
  "メタル",
  "インディー",
]

