import { useRef, useState } from "react";
import { LiveOrb } from "@/components/ui/live-orb";
import { CameraPreview } from "@/components/video/camera_preview";
import { LiveCommerce } from "../commerce";
import { useGeminiLive } from "@/hooks/gemini_live";

import { SYSTEM_MESSAGE_SETTINGS } from "@/lib/SystemMessage";
import { Image as ImageIcon, Phone, PhoneOff, RefreshCw, Loader2 } from "lucide-react";

export function App() {
  const stageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSearchingImage, setIsSearchingImage] = useState(false);

  const {
    startConnection,
    disconnect,
    isConnected,
    status,
    videoRef,
    canvasRef,
    mediaStream,
    sendText,
    sendImage,
    isAudioPlaying,
    isUserTalking,
    micVolume,
    isVideoEnabled,
    cameraFacing,
    flipCamera,
  } = useGeminiLive(SYSTEM_MESSAGE_SETTINGS);

  const handleCommerceIntent = (intent: any) => {
    if (intent.type === "add_to_cart") {
      sendText("Please add this item to my cart.");
    } else if (intent.type === "checkout") {
      sendText("I am ready to proceed to checkout.");
    } else if (intent.type === "update_qty") {
      sendText(`Update item quantity to ${intent.qty}.`);
    } else if (intent.type === "remove_line") {
      sendText("Remove this item from my cart.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSearchingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const base64Data = (reader.result as string).split(",")[1];
        if (!base64Data) return;

        sendImage(base64Data, file.type || "image/jpeg");
        sendText("I just shared this photo. Please look at it and check our store catalog for matching products or answer any questions about it.");
      } finally {
        setIsSearchingImage(false);
      }
    };
    reader.onerror = () => setIsSearchingImage(false);
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  return (
    <div
      ref={stageRef}
      className="flex min-h-svh w-full flex-col items-center justify-between p-4 bg-zinc-950 text-white relative overflow-hidden select-none"
    >
      {/* Top Status Bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 px-4 z-40">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isConnected
                ? isAudioPlaying
                  ? "bg-purple-500 animate-pulse"
                  : isUserTalking
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-green-500"
                : status === "connecting"
                ? "bg-amber-500 animate-ping"
                : status === "error"
                ? "bg-red-500"
                : "bg-zinc-600"
            }`}
          />
          <span className="text-xs font-medium tracking-wide uppercase text-zinc-400">
            {status === "live"
              ? isAudioPlaying
                ? "Agent Speaking..."
                : isUserTalking
                ? "Listening..."
                : "Connected"
              : status === "connecting"
              ? "Connecting..."
              : status === "error"
              ? "Connection Error"
              : "Ready"}
          </span>
        </div>
      </header>

      {/* Main Orb Centerpiece */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full my-auto z-10">
        <div className="relative flex items-center justify-center">
          <LiveOrb
            variant="webgl"
            status={status}
            isSpeaking={isAudioPlaying}
            isListening={isUserTalking}
            volume={micVolume}
            size={280}
          />
        </div>
      </main>

      {/* Live Commerce Layer (Products, Details, Cart, Checkout) */}
      <div className="w-full max-w-4xl z-30 pointer-events-auto">
        <LiveCommerce sessionActive={isConnected} onIntent={handleCommerceIntent} />
      </div>

      {/* Draggable Camera Preview */}
      {isVideoEnabled && isConnected && (
        <CameraPreview
          videoRef={videoRef}
          stream={mediaStream}
          cameraFacing={cameraFacing}
          stageRef={stageRef}
          onFlip={flipCamera}
        />
      )}

      {/* Bottom Floating Control Bar */}
      <footer className="w-full flex items-center justify-center pb-6 pt-2 z-40">
        <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-full px-5 py-2.5 shadow-2xl">
          {!isConnected ? (
            <button
              onClick={() => startConnection("Aoede")}
              disabled={status === "connecting"}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all disabled:opacity-50 shadow-lg shadow-emerald-900/40 cursor-pointer"
            >
              <Phone className="w-4 h-4 fill-current" />
              {status === "connecting" ? "Connecting..." : "Start Live Call"}
            </button>
          ) : (
            <>
              {/* Image Search Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isSearchingImage}
                aria-label="Upload photo to search products"
                title="Search products by photo"
                className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-all cursor-pointer disabled:opacity-50"
              >
                {isSearchingImage ? (
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Flip Camera */}
              <button
                onClick={flipCamera}
                aria-label="Flip camera"
                title="Flip camera"
                className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-all cursor-pointer"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* End Call */}
              <button
                onClick={disconnect}
                aria-label="End live call"
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-all shadow-lg shadow-red-900/40 cursor-pointer"
              >
                <PhoneOff className="w-4 h-4 fill-current" />
                End Call
              </button>
            </>
          )}
        </div>
      </footer>

      {/* Hidden Frame Capture Canvas for Video Processing */}
      <canvas ref={canvasRef} width={1280} height={720} style={{ display: "none" }} />
    </div>
  );
}

export default App;
