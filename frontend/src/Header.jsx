export default function () {
  return (
    <div
      className="navbar bg-accent-t80"
      style={{ borderBottom: "1px solid var(--theme-t50)" }}
    >
      <div className="container-fluid">
        <div style={{ padding: "5px 10px" }}>
          <a
            style={{
              fontSize: "20px",
              textDecoration: "none",
              cursor: "pointer",
            }}
            className="fw-semibold text-accent"
            // href="/"
          >
            Media Downloader
          </a>
        </div>
      </div>
    </div>
  );
}
