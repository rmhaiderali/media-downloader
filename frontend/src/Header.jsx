export default function () {
  return (
    <div
      className="navbar"
      style={{
        backgroundColor: "var(--theme-t80)",
        borderBottom: "1px solid var(--theme-t50)",
      }}
    >
      <div className="container-fluid">
        <div style={{ padding: "5px 10px" }}>
          <a
            className="fw-semibold text-accent"
            style={{
              fontSize: "20px",
              textDecoration: "none",
              cursor: "pointer",
            }}
            // href="/"
          >
            Media Downloader
          </a>
        </div>
      </div>
    </div>
  );
}
