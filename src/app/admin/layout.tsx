import { Header } from "@/components";
import ASidebar from "@/components/Sidebar/Admin/ASidebar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <div className="flex w-full flex-grow">
        <ASidebar />
        <div className="flex-grow bg-highlight overflow-y-auto">
          <div className="min-h-full w-full">{children}</div>
        </div>
      </div>
    </div>
);
}
