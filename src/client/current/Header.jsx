export default function () {
  return (
    <div
      className="navbar"
      style={{
        background: "var(--theme-t80)",
        borderBottom: "1px solid var(--theme-t50)",
      }}
    >
      <div className="container-fluid justify-content-start">
        <div style={{ padding: "5px 10px" }}>
          <a
            className="text-accent"
            style={{ fontSize: "20px", textDecoration: "none" }}
            href={BASE + "experimental/"}
          >
            Media Downloader
          </a>
        </div>
      </div>
    </div>
  );
}
