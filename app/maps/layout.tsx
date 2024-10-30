export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-row items-center justify-center w-full h-full py-0">
      <div className="container mx-auto max-w-9xl h-full py-0 flex-grow">
        {children}
      </div>
    </section>
  );
}
