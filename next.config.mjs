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
    ],
  },
};

export default nextConfig;
