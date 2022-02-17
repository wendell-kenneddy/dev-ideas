export function Spinner() {
  return (
    <div
      className="spinner-border border-b-transparent animate-spin inline-block w-6 h-6 border-4 rounded-full"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
