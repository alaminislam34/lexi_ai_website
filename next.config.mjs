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
        hostname: "10.10.7.19", // Added this
        port: "8001", // Added the port from your error message
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
