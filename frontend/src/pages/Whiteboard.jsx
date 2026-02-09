import Sidebar from "../components/Sidebar";
import PageTransition from "../components/PageTransition";
import { Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";

const Whiteboard = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar />

        <div className="flex-1 flex flex-col pl-0 lg:pl-64 pt-20 h-screen overflow-hidden relative">

          {/* Header / Controls Overlay */}
          <div className="absolute top-24 right-6 z-10 flex gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-slate-800 text-slate-300 rounded-lg shadow-lg border border-slate-700 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>

          <div className="flex-1 w-full h-full bg-white rounded-tl-2xl border-l border-t border-slate-800 overflow-hidden shadow-2xl">
            <iframe
              src="https://excalidraw.com?theme=dark"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              title="Excalidraw Whiteboard"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Whiteboard;