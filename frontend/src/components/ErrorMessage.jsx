function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-banner">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
