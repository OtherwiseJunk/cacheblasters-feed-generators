import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import {
  isGriddeningContent,
  mapGriddeningPostToDBPost,
} from './subscriptions/magicthegriddening.subscriptions'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return
    const ops = await getOpsByType(evt)

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const magicTheGriddeningPostsToCreate = ops.posts.creates
      .filter(isGriddeningContent)
      .map(mapGriddeningPostToDBPost)

    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (magicTheGriddeningPostsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(magicTheGriddeningPostsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}
