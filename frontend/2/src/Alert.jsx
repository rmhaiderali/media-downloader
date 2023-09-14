export default function ({ message }) {
  return (
    <div className="py-3">
      <div className="alert rounded-top-2 rounded-bottom-2 text-accent text-center">
        {message}
      </div>
    </div>
  );
}
