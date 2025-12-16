export default function RootSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="container mx-auto px-4 py-20">{children}</section>;
}
