import LoadingSpinner from "@components/loadingSpinner";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <LoadingSpinner size={10} />
    </div>
  );
}
