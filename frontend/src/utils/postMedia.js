export function getPostCover(post) {
  const explicitCover = post?.cover_image || post?.coverImage || ''
  if (explicitCover) {
    return explicitCover
  }

  const content = typeof post?.content === 'string' ? post.content : ''
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1] || ''
}
