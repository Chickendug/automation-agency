import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return [
      {
        source: "/docs/appointment-reminders-build.md",
        destination: "/guides/appointment-reminders",
        permanent: true,
      },
      {
        source: "/docs/deposit-hold-addon.md",
        destination: "/guides/deposit-hold",
        permanent: true,
      },
      {
        source: "/docs/missed-call-recovery-build.md",
        destination: "/guides/missed-call-recovery",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
