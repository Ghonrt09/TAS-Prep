import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This wrapper keeps the sidebar and content aligned on dashboard pages.
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
