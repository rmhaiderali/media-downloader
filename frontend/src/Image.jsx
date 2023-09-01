export default function ({ url }) {
  function adjust(e) {
    if (e.target.naturalHeight < e.target.naturalWidth)
      e.target.style.removeProperty("height");
    else if (e.target.naturalWidth < e.target.naturalHeight)
      e.target.style.removeProperty("width");

    e.target.style.removeProperty("display");
  }

  return (
    <div
      style={{
        width: "300px",
        height: "300px",
        backgroundColor: "black",
        borderRadius: "6px",
        overflow: "hidden",
        display: "flex",
        flexWrap: "wrap",
        placeContent: "center",
      }}
    >
      <img
        onLoad={adjust}
        style={{
          display: "none",
          width: "100%",
          height: "100%",
        }}
        src={url}
      ></img>
    </div>
  );
}
