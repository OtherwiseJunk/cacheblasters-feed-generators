export const griddeningPostsDB = 'magicTheGriddening'

export function isGriddeningContent(post): boolean {
  const lowercaseText = post.record.text.toLowerCase()
  return (
    lowercaseText.includes('#magicthegriddening') ||
    lowercaseText.includes('#magic:thegriddening') ||
    lowercaseText.includes('magic the griddening') ||
    lowercaseText.includes('magic: the griddening')
  )
}

export function mapGriddeningPostToDBPost(post) {
  return {
    uri: post.uri,
    cid: post.cid,
    replyParent: post.record?.reply?.parent.uri ?? null,
    replyRoot: post.record?.reply?.root.uri ?? null,
    indexedAt: new Date().toISOString(),
    type: griddeningPostsDB,
  }
}
