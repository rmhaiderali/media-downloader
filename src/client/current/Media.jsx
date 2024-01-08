import Image from "./Image";
import Video from "./Video";

export default function ({ items, platform }) {
  return (
    <div
      className="mt-4"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {items.map((item) => {
        const Media = item.format === "mp4" ? Video : Image;
        item.url =
          (PROXY ? PROXY + "/" + item.path + "?url=" : "") +
          SERVER +
          "media/" +
          platform.current +
          "/" +
          item.path;

        return (
          <div
            style={{
              margin: "10px",
              width: "300px",
              height: "350px",
              display: "flex",
              flexDirection: "column",
            }}
            key={item.path}
          >
            <Media item={item} />
            <a
              download
              href={item.url + "?download=1"}
              className="btn btn-outline-accent"
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
