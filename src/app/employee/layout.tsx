export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="w-fill">{children}</div>
    </div>
  );
}
