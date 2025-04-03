export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-70 z-50">
      <span className="loading loading-ball loading-xs mr-2" />
    </div>
  );
}
