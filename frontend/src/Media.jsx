import Image from "./Image";
import Video from "./Video";

export default function ({ urls, platform }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {urls.map((url) => {
        const Media = url.split(".")[1] === "mp4" ? Video : Image;
        url = SERVER + "media/" + platform.current + "/" + url;

        return (
          <div
            style={{
              margin: "10px",
              width: "300px",
              height: "350px",
              display: "flex",
              flexDirection: "column",
            }}
            key={url}
          >
            <Media url={url} />
            <a
              download
              href={url + "?download=1"}
              className="btn"
              style={{ width: "100%", marginTop: "12px" }}
            >
              Download
            </a>
          </div>
        );
      })}
    </div>
  );
}
