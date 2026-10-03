import UsersDirectory from "../users/UsersDirectory";

export const dynamic = "force-dynamic";

export default async function AdminFacultyPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const resolvedParams = await searchParams;
  return <UsersDirectory role="INSTRUCTOR" search={resolvedParams?.search || ""} />;
}
