import { useRef } from "react";

export default function ({ item }) {
  const blur = useRef();

  const size = { width: "100%", height: "100%" };
  if (item.height < item.width) delete size.height;
  else if (item.width < item.height) delete size.width;

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
        ref={blur}
        style={size}
        src={"data:image/" + item.format + ";base64," + item.blur}
      ></img>
      <img
        onLoad={(e) => {
          blur.current.style.display = "none";
          e.target.style.removeProperty("display");
        }}
        style={Object.assign({ display: "none" }, size)}
        src={item.url}
      ></img>
    </div>
  );
}
