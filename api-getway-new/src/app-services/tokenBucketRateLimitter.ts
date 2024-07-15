import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject } from "@nestjs/common";
import {Cache} from 'cache-manager'


export class TokenBucketService{
constructor( @Inject(CACHE_MANAGER) private cacheManager: Cache){}
async TokenBucketTakeToken(key:string,bucketSize:number,refillRate:number) {
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    const bucketKey = `bucket:${key}`;

    this.cacheManager
    // Get the current state of the token bucket
    let bucket:any = await this.cacheManager.get(bucketKey);
    if (!bucket) {
      bucket = {
        tokens: bucketSize,
        lastRefill: currentTime
      };
    }
    console.log(`bucket data :${JSON.stringify(bucket)}`)

    // Refill the tokens based on elapsed time
    const elapsedTime = currentTime - bucket.lastRefill;
    const tokensToAdd = Math.min(bucketSize, elapsedTime * refillRate);
    bucket.tokens = Math.min(bucketSize, bucket.tokens + tokensToAdd);
    bucket.lastRefill = currentTime;

    // Check if there's a token available
    if (bucket.tokens > 0) {
      bucket.tokens -= 1;
      await this.cacheManager.set(bucketKey, bucket);
      return true;
    } else {
      await this.cacheManager.set(bucketKey, bucket);
      return false;
    }
  }
}