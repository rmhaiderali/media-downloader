export default function ({ message }) {
  return (
    <div className="py-3">
      <div className="alert rounded-top-2 rounded-bottom-2 text-danger text-center alert-danger">
        {message}
      </div>
    </div>
  );
}
