import { Metadata } from "next";
import UsersPageClient from "@/components/users/UsersPageClient";

export const metadata: Metadata = {
  title: "Users | On The Bite Admin",
  description:
    "Manage all registered users — view access levels, reports, and activity.",
};

export default function UsersPage() {
  return <UsersPageClient />;
}
