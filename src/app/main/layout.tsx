import Dock from "@/components/ui/dock/Dock";
import Header from "@/components/ui/header/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div
        className="w-full h-64 bg-no-repeat"
        style={{
          backgroundImage: "url('/main-bg-l.png'), url('/main-bg-r.png')",
          backgroundPosition: "top left, top right",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "auto 12vw, auto 12vw",
        }}
      >
        <main className="pt-10 mb-40 pb-40 max-w-2x mx-auto">{children}</main>
      </div>
      <Dock />
    </>
  );
}
