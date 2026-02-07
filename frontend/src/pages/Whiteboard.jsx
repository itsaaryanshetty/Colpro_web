import Sidebar from "../components/Sidebar";

const Whiteboard = () => {
  return (
    <div style={{ display: "flex", height: "calc(100vh - 110px)" }}>
      {/* Your existing Sidebar */}
      <Sidebar />

      {/* Excalidraw iframe */}
      <iframe
        src="https://excalidraw.com"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Excalidraw Whiteboard"
      />
    </div>
  );
};

export default Whiteboard;