export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="mt-10 mb-40 max-w-2xl mx-auto p-2">{children}</main>;
}
