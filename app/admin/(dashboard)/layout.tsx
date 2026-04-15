import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-dashboard-shell min-h-screen bg-zinc-100 text-base text-zinc-900">
      <AdminSidebar />
      <main className="pl-60">
        <div className="px-8 py-8">
          <div className="max-w-6xl mx-auto space-y-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
