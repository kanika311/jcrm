import UsersDirectory from "../users/UsersDirectory";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const resolvedParams = await searchParams;
  return <UsersDirectory role="STUDENT" search={resolvedParams?.search || ""} />;
}
