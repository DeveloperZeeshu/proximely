import { Ratelimit } from '@upstash/ratelimit'
import redis from './redisDB'

const rateLimit = (limit: number = 5) => {
    return new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(limit, '1 m')
    })
}

export default rateLimit
