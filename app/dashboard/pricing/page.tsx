import { Metadata } from "next";
import PricingPageClient from "@/components/pricing/PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing | On The Bite Admin",
  description:
    "Manage subscription tiers, pricing plans, and features for On The Bite users.",
};

export default function PricingPage() {
  return <PricingPageClient />;
}
