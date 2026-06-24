import { redirect } from "next/navigation";

// This page is never accessed directly — the "New Project" button calls a server action
// that creates a draft and redirects to the edit page. Redirect if manually visited.
export default function NewProjectPage() {
  redirect("/admin/projects");
}
