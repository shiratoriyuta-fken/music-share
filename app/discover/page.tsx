import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Heart, Music, Search } from "lucide-react"

export default function DiscoverPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">音楽を探す</h1>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="アーティスト、曲名、ジャンルで検索..." className="pl-10" />
      </div>

      <Tabs defaultValue="recommended" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommended">おすすめ</TabsTrigger>
          <TabsTrigger value="trending">トレンド</TabsTrigger>
          <TabsTrigger value="new">新着</TabsTrigger>
          <TabsTrigger value="genres">ジャンル</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">あなたへのおすすめ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedPosts.map((post) => (
              <RecommendationCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">今話題の投稿</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPosts.map((post) => (
              <RecommendationCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">新着投稿</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{/* 新着投稿のコンテンツ */}</div>
        </TabsContent>

        <TabsContent value="genres" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">ジャンルから探す</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {genres.map((genre) => (
              <Link key={genre} href={`/tags/${genre}`}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="flex items-center justify-center p-6">
                    <span className="text-lg font-medium">{genre}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">今週のプレイリスト</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {weeklyPlaylists.map((playlist) => (
            <Card key={playlist.id} className="overflow-hidden">
              <Link href={`/playlists/${playlist.id}`}>
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={playlist.coverImage || "/placeholder.svg"}
                    alt={playlist.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/playlists/${playlist.id}`}>
                  <h3 className="font-medium hover:text-primary transition-colors">{playlist.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-1">{playlist.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Music size={16} className="mr-1" />
                  <span>{playlist.trackCount}曲</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Heart size={16} className="mr-1" />
                  <span>{playlist.likes}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

function RecommendationCard({ post }: { post: any }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <Link href={`/posts/${post.id}`}>
          <CardTitle className="text-lg hover:text-primary transition-colors">{post.title}</CardTitle>
        </Link>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href={`/users/${post.authorId}`} className="font-medium hover:text-primary transition-colors">
            {post.author}
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="aspect-video bg-muted rounded-md mb-3 overflow-hidden">
          <img src={post.coverImage || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center pt-2">
        <div className="flex items-center gap-1">
          <Heart size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{post.likes}</span>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">{post.reason}</div>
      </CardFooter>
    </Card>
  )
}

// ダミーデータ
const recommendedPosts = [
  {
    id: "1",
    title: "Aimer「残響散歌」の歌詞分析",
    author: "音楽評論家",
    authorId: "101",
    coverImage: "/placeholder.svg?height=200&width=400",
    tags: ["J-Pop", "アニメ", "歌詞分析"],
    likes: 87,
    reason: "あなたが「J-Pop」に興味があるため",
  },
  {
    id: "2",
    title: "ジャズ初心者におすすめのアルバム10選",
    author: "ジャズマニア",
    authorId: "102",
    coverImage: "/placeholder.svg?height=200&width=400",
    tags: ["ジャズ", "初心者向け", "おすすめ"],
    likes: 65,
    reason: "あなたが「おすすめリスト」を閲覧したため",
  },
  {
    id: "3",
    title: "ヒップホップの歴史：90年代から現在まで",
    author: "音楽歴史家",
    authorId: "103",
    coverImage: "/placeholder.svg?height=200&width=400",
    tags: ["ヒップホップ", "音楽史", "90年代"],
    likes: 112,
    reason: "あなたが「音楽史」に関する投稿を読んだため",
  },
]

const trendingPosts = [
  {
    id: "4",
    title: "YOASOBI「アイドル」徹底解説",
    author: "ポップカルチャー評論家",
    authorId: "104",
    coverImage: "/placeholder.svg?height=200&width=400",
    tags: ["J-Pop", "YOASOBI", "楽曲分析"],
    likes: 203,
    reason: "今週最も読まれている投稿",
  },
  {
    id: "5",
    title: "2023年ベスト・アルバム・ランキング",
    author: "音楽ジャーナリスト",
    authorId: "105",
    coverImage: "/placeholder.svg?height=200&width=400",
    tags: ["ランキング", "2023年", "アルバム"],
    likes: 178,
    reason: "話題のトピック",
  },
  {
    id: "6",
    title: "ビリー・アイリッシュの新曲分析",
    author: "洋楽専門家",
    authorId: "106",
    coverImage: "/placeholder.svg?height=200&width=400",
    tags: ["ポップ", "ビリー・アイリッシュ", "新曲"],
    likes: 156,
    reason: "急上昇中",
  },
]

const weeklyPlaylists = [
  {
    id: "1",
    title: "雨の日に聴きたい曲",
    description: "梅雨の季節にぴったりの落ち着いた曲集",
    coverImage: "/placeholder.svg?height=300&width=300",
    trackCount: 12,
    likes: 45,
  },
  {
    id: "2",
    title: "朝の活力チャージ",
    description: "一日を元気にスタートするためのプレイリスト",
    coverImage: "/placeholder.svg?height=300&width=300",
    trackCount: 15,
    likes: 67,
  },
  {
    id: "3",
    title: "90年代J-POPベスト",
    description: "懐かしの90年代J-POP名曲集",
    coverImage: "/placeholder.svg?height=300&width=300",
    trackCount: 20,
    likes: 89,
  },
  {
    id: "4",
    title: "作業用BGM",
    description: "集中力を高める落ち着いた曲のセレクション",
    coverImage: "/placeholder.svg?height=300&width=300",
    trackCount: 18,
    likes: 124,
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
  "アニソン",
  "K-Pop",
]

