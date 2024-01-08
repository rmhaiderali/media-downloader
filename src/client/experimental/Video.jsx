export default function ({ item }) {
  return (
    <video
      style={{
        minWidth: "300px",
        minHeight: "300px",
        width: "300px",
        height: "300px",
        backgroundColor: "#fff8",
        borderRadius: "6px",
      }}
      controls
      controlsList="nodownload"
    >
      <source src={item.url} />
    </video>
  );
}
