import { useRef } from "react";
import { LiveOrb } from "@/components/ui/live-orb";
import { CameraPreview } from "@/components/video/camera_preview";
import { LiveCommerce } from "../commerce";
import { useGeminiLive } from "@/hooks/gemini_live";

import { SYSTEM_MESSAGE_SETTINGS } from "@/lib/SystemMessage";
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, RefreshCw } from "lucide-react";

export function App() {
  const stageRef = useRef<HTMLDivElement>(null);

  const {
    startConnection,
    disconnect,
    isConnected,
    status,
    videoRef,
    canvasRef,
    mediaStream,
    isAudioPlaying,
    isUserTalking,
    micVolume,
    isMuted,
    toggleMute,
    isVideoEnabled,
    toggleVideo,
    cameraFacing,
    flipCamera,
  } = useGeminiLive(SYSTEM_MESSAGE_SETTINGS);

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
        <LiveCommerce sessionActive={isConnected} />
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
              {/* Mic Toggle */}
              <button
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  isMuted
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Video Toggle */}
              <button
                onClick={toggleVideo}
                aria-label={isVideoEnabled ? "Disable camera" : "Enable camera"}
                className={`p-3 rounded-full transition-all cursor-pointer ${
                  !isVideoEnabled
                    ? "bg-zinc-800 text-zinc-500"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
              >
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* Flip Camera (if video active) */}
              {isVideoEnabled && (
                <button
                  onClick={flipCamera}
                  aria-label="Flip camera"
                  className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-all cursor-pointer"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}

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
