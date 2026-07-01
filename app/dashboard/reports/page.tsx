import { Metadata } from "next";
import ReportPageClient from "@/components/report/ReportPageClient";

export const metadata: Metadata = {
  title: "Reports | On The Bite Admin",
  description:
    "Manage and review all fishing reports submitted by users. Approve, flag, or remove reports from the dashboard.",
};

export default function ReportsPage() {
  return <ReportPageClient />;
}
