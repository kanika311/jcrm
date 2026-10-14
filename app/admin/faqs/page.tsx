import { redirect } from "next/navigation";

export default function AdminFaqsPage() {
  redirect("/admin/cms?page=public-faq");
}
