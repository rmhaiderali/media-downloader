export default function ({ url }) {
  return (
    <div className="download">
      <video
        style={{
          minWidth: "300px",
          minHeight: "300px",
          width: "300px",
          height: "300px",
          backgroundColor: "black",
          borderRadius: "6px",
        }}
        controls
        controlsList="nodownload"
      >
        <source src={url} />
      </video>
      <a
        href={url + "?download=1"}
        download
        className="btn btn-outline-danger"
        style={{ width: "100%", marginTop: "12px" }}
      >
        Download
      </a>
    </div>
  );
}
