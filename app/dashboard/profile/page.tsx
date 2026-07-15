import { Metadata } from "next";
import ProfilePageClient from "@/components/profile/ProfilePageClient";

export const metadata: Metadata = {
  title: "Admin Profile | On The Bite",
  description: "View your admin profile details and account status.",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
