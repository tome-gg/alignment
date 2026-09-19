import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "./redis";

let _ratelimit: Ratelimit | null = null;

export function getChatRatelimit(): Ratelimit {
  if (!_ratelimit) {
    _ratelimit = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "ratelimit:chat",
    });
  }
  return _ratelimit;
}

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
