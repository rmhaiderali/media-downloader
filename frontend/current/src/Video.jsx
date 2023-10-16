export default function ({ item }) {
  return (
    <video
      style={{
        minWidth: "300px",
        minHeight: "300px",
        width: "300px",
        height: "300px",
        backgroundColor: "black",
        borderRadius: "6px"
      }}
      controls
      controlsList="nodownload"
    >
      <source src={item.url} />
    </video>
  )
}
