import Dock from "@/components/ui/dock/Dock";
import Header from "@/components/ui/header/Header";
import AuthProvider from "@/providers/AuthProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Header />
      <main className="mt-10 mb-40 max-w-2xl mx-auto p-2">{children}</main>
      <Dock />
    </AuthProvider>
  );
}
