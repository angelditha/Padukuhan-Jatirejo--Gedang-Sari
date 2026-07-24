import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://padukuhan-jatirejo-gedang-sari.vercel.app/sitemap.xml",
  };
}
