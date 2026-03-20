import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-neutral-500">Not found</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-950">
          That page does not exist.
        </h1>
        <Link href="/packets" className="mt-4 inline-block text-sm underline">
          Back to packets
        </Link>
      </div>
    </div>
  );
}
