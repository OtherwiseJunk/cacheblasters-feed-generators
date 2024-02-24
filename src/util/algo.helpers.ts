import { InvalidRequestError } from '@atproto/xrpc-server';
import { AppContext } from "../config";
import { Post } from "../db/schema";
import { QueryParams } from '../lexicon/types/app/bsky/feed/getFeedSkeleton'

export async function retrievePostByType(ctx: AppContext, params: QueryParams, type: string): Promise<Post[]> {
    let builder = ctx.db
    .selectFrom('post')
    .where('type', '=', type)
    .selectAll()
    .orderBy('indexedAt', 'desc')
    .orderBy('cid', 'desc')
    .limit(params.limit)

  if (params.cursor) {
    const [indexedAt, cid] = params.cursor.split('::')
    if (!indexedAt || !cid) {
      throw new InvalidRequestError('malformed cursor')
    }
    const timeStr = new Date(parseInt(indexedAt, 10)).toISOString()
    builder = builder
      .where('post.indexedAt', '<', timeStr)
      .orWhere((qb) => qb.where('post.indexedAt', '=', timeStr))
      .where('post.cid', '<', cid)
  }

  return await builder.execute();
}