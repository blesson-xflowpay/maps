import MapCardCarto from "@/components/MapCardCarto";

export default function Home() {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16 sm:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#eef1ff] blur-[90px]" />
        <div className="absolute right-[-120px] top-1/3 h-80 w-80 rounded-full bg-[#dde8ff] blur-[110px]" />
        <div className="absolute bottom-[-140px] left-1/3 h-96 w-96 rounded-full bg-[#f2f6ff] blur-[120px]" />
      </div>
      <section className="w-full max-w-5xl">
        <MapCardCarto />
      </section>
    </div>
  );
}
