import { Metadata } from "next";
import SettingsPageClient from "@/components/settings/SettingsPageClient";

export const metadata: Metadata = {
  title: "Settings | On The Bite Admin",
  description:
    "Manage admin notifications, data retention policies, and account settings for On The Bite.",
};

export default function SettingsPage() {
  return <SettingsPageClient />;
}
