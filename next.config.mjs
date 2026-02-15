/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "3.141.14.219",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "10.10.7.19",
        port: "8002", // আপনার এরর মেসেজ অনুযায়ী এখানে 8002 হবে
        pathname: "/media/**",
      },
      // অথবা যদি আপনার API কখনো 8001 আবার কখনো 8002 হয়, তবে নিচের মতো দিতে পারেন:
      {
        protocol: "http",
        hostname: "10.10.7.19",
        port: "", // পোর্ট খালি রাখলে ওই হোস্টনেমের সব পোর্ট এলাউ করবে
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
