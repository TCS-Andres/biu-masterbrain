import type { MetadataRoute } from "next";
import { NOINDEX } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return NOINDEX
    ? { rules: { userAgent: "*", disallow: "/" } }
    : { rules: { userAgent: "*", allow: "/" } };
}
