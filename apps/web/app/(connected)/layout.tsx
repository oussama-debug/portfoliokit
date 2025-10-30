import { Sidebar } from "../../components/sidebar";

export default async function ConnectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-primary-foreground flex flex-row justify-start items-start w-full">
      <Sidebar />
      {children}
    </section>
  );
}
