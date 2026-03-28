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
        port: "8002",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "10.10.7.19",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**", // This allows all avatar styles and seeds
      },
      {
        protocol: "http",
        hostname: "3.142.150.64",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "10.10.7.19",
        port: "8000", // Add this specific port
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
