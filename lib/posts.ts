import { supabase } from './supabase';

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users (id, name, email, image),
      post_tags (
        tags (id, name)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('投稿の取得エラー:', error);
    return [];
  }

  return data || [];
}

export async function getPostById(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      users (id, name, email, image),
      post_tags (
        tags (id, name)
      ),
      comments (
        *,
        users (id, name, image)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('投稿の取得エラー:', error);
    return null;
  }

  return data;
}

export async function createPost(postData: any) {
    // 1. 投稿を作成
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert([
        {
          title: postData.title,
          content: postData.content,
          user_id: postData.userId,
          artist: postData.artist,
          song: postData.song,
          embed_url: postData.embedUrl,
          cover_image: postData.coverImage,
        }
      ])
      .select()
      .single();
  
    if (postError) {
      console.error('投稿の作成エラー:', postError);
      throw postError;
    }
  
    // 2. タグを処理
    if (postData.tags && postData.tags.length > 0) {
      for (const tagName of postData.tags) {
        // タグが存在するか確認
        const { data: existingTag, error: tagError } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .single();
  
        let tagId;
  
        if (tagError) {
          // タグが存在しない場合は作成
          const { data: newTag, error: createTagError } = await supabase
            .from('tags')
            .insert([{ name: tagName }])
            .select()
            .single();
  
          if (createTagError) {
            console.error('タグの作成エラー:', createTagError);
            continue;
          }
  
          tagId = newTag.id;
        } else {
          tagId = existingTag.id;
        }
  
        // post_tagsに関連付けを追加
        const { error: linkError } = await supabase
          .from('post_tags')
          .insert([
            {
              post_id: post.id,
              tag_id: tagId
            }
          ]);
  
        if (linkError) {
          console.error('タグの関連付けエラー:', linkError);
        }
      }
    }
  
    return post;
  }