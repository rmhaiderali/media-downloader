export default function () {
  return (
    <div
      className="navbar"
      style={{
        backgroundColor: "var(--theme-t80)",
        borderBottom: "1px solid var(--theme-t50)",
      }}
    >
      <div className="container-fluid justify-content-start cursor-pointer">
        <div style={{ padding: "5px 10px" }}>
          <a
            className="text-accent"
            style={{ fontSize: "20px", textDecoration: "none" }}
            href="/experimental"
          >
            Media Downloader
          </a>
        </div>
      </div>
    </div>
  );
}
