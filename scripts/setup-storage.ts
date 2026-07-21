/**
 * One-time setup: creates the Supabase Storage buckets Vinci AI needs.
 * Run with: npx tsx scripts/setup-storage.ts
 * Requires SUPABASE_SERVICE_ROLE_KEY in your environment.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
  );
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const buckets: { name: string; public: boolean; fileSizeLimitMb: number }[] = [
  {
    name: process.env.SUPABASE_STORAGE_BUCKET_COLLECTIBLES ?? "collectible-images",
    public: true,
    fileSizeLimitMb: 10,
  },
  {
    name: process.env.SUPABASE_STORAGE_BUCKET_AVATARS ?? "avatars",
    public: true,
    fileSizeLimitMb: 3,
  },
  {
    name: process.env.SUPABASE_STORAGE_BUCKET_EXPORTS ?? "exports",
    public: false,
    fileSizeLimitMb: 25,
  },
];

async function main() {
  for (const bucket of buckets) {
    const { data: existing } = await supabase.storage.getBucket(bucket.name);
    if (existing) {
      console.log(`✓ bucket "${bucket.name}" already exists`);
      continue;
    }
    const { error } = await supabase.storage.createBucket(bucket.name, {
      public: bucket.public,
      fileSizeLimit: bucket.fileSizeLimitMb * 1024 * 1024,
    });
    if (error) {
      console.error(`✗ failed to create "${bucket.name}":`, error.message);
    } else {
      console.log(`✓ created bucket "${bucket.name}" (public: ${bucket.public})`);
    }
  }
}

main();
