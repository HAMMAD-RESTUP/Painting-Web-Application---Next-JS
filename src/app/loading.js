export default function Loading() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center bg-[#fffdfb]" role="status" aria-live="polite">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#d8c7ba] border-t-[#6f5543]" />
        <p className="mt-4 text-sm text-[#786b62]">Preparing your experience…</p>
      </div>
    </div>
  );
}
