// app/posts/[id]/page.tsx
import PostPageClient from './PostPageClient';

export default function PostPage({ params }: { params: { id: string } }) {
  // サーバー側で params.id を受け取り、そのまま渡す
  const id = params.id;
  return <PostPageClient id={id} />;
}
