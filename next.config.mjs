// Cloudflare-এর লোকাল ডেভ হেল্পার শুধু Netlify-এর বাইরে চালু হয়।
if (!process.env.NETLIFY) {
  const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
