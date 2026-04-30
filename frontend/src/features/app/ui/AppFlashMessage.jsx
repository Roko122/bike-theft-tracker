export default function AppFlashMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="app-flash" role="status" aria-live="polite">
      {message}
    </div>
  );
}
