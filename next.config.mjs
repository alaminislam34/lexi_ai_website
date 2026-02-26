/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "3.142.150.64",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "10.10.7.19",
        port: "8001",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "10.10.7.19",
        port: "",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
