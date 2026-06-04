import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { connect, disconnect } from "../lib/game/multiplayerSocket";

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function GameRoom() {
  const router = useRouter();
  const [status, setStatus] = useState("connecting"); // connecting | waiting | joining | ready | full | error
  const [roomCode, setRoomCode] = useState("");
  const [copied, setCopied] = useState(false);
  const roleRef = useRef(null);
  const roomCodeRef = useRef("");

  useEffect(() => {
    const { room } = router.query;
    // router.query may be empty on first render in Next.js pages router
    if (!router.isReady) return;

    const code = room || generateRoomCode();
    roomCodeRef.current = code;
    setRoomCode(code);
    setStatus(room ? "joining" : "connecting");

    connect(
      code,
      (msg) => {
        if (msg.type === "role") {
          roleRef.current = msg.role;
        } else if (msg.type === "ready") {
          setStatus("ready");
          setTimeout(() => {
            router.push(`/game?room=${roomCodeRef.current}&role=${roleRef.current}`);
          }, 800);
        } else if (msg.type === "error") {
          setStatus(msg.message === "Room is full" ? "full" : "error");
        } else if (msg.type === "partner-left") {
          setStatus("error");
        }
      },
      () => {
        setStatus(room ? "joining" : "waiting");
      }
    );

    return () => {
      disconnect();
    };
  }, [router.isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/game-room?room=${roomCode}` : "";

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const isHost = !router.query.room;

  return (
    <>
      <Head>
        <title>Multiplayer Lobby — AlifallX</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="game-room-page">
        <div className="game-room-card">
          <div className="game-room-title">
            <span className="game-room-title-emoji">👾</span>
            <span>AlifallX</span>
          </div>
          <div className="game-room-subtitle">2-Player Mode</div>

          {status === "connecting" && (
            <div className="game-room-status">Connecting…</div>
          )}

          {status === "waiting" && isHost && (
            <>
              <div className="game-room-status game-room-status--waiting">
                Waiting for Player 2…
              </div>
              <div className="game-room-code-block">
                <div className="game-room-code-label">Room code</div>
                <div className="game-room-code">{roomCode}</div>
              </div>
              <div className="game-room-share-label">Share this link with your friend:</div>
              <div className="game-room-share-row">
                <div className="game-room-share-url">{shareUrl}</div>
                <button className="game-room-copy-btn" onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </>
          )}

          {status === "joining" && !isHost && (
            <div className="game-room-status game-room-status--waiting">
              Joining room <strong>{roomCode}</strong>…
            </div>
          )}

          {status === "ready" && (
            <div className="game-room-status game-room-status--ready">
              Both players connected! Starting…
            </div>
          )}

          {status === "full" && (
            <>
              <div className="game-room-status game-room-status--error">Room is full</div>
              <button className="game-room-back-btn" onClick={() => router.push("/game-room")}>
                Create new room
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="game-room-status game-room-status--error">Connection lost</div>
              <button className="game-room-back-btn" onClick={() => router.push("/game-room")}>
                Try again
              </button>
            </>
          )}

          <button className="game-room-solo-link" onClick={() => router.push("/game")}>
            ← Back to solo play
          </button>
        </div>
      </div>

      <style jsx>{`
        .game-room-page {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #060b1a;
          padding: 24px;
        }
        .game-room-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(180,100,255,0.2);
          border-radius: 20px;
          padding: 40px 32px;
          max-width: 440px;
          width: 100%;
          text-align: center;
        }
        .game-room-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 26px;
          font-weight: 900;
          color: #fff;
          letter-spacing: 4px;
          text-transform: uppercase;
        }
        .game-room-title-emoji { font-size: 28px; }
        .game-room-subtitle {
          font-size: 11px;
          letter-spacing: 5px;
          color: rgba(180,100,255,0.7);
          text-transform: uppercase;
          margin-top: -12px;
        }
        .game-room-status {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          letter-spacing: 1px;
        }
        .game-room-status--waiting {
          color: rgba(100,200,255,0.9);
          animation: pulse-text 2s ease-in-out infinite;
        }
        .game-room-status--ready {
          color: rgba(100,255,160,0.9);
          font-weight: 700;
        }
        .game-room-status--error { color: rgba(255,100,100,0.9); }
        @keyframes pulse-text {
          0%,100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        .game-room-code-block {
          background: rgba(180,100,255,0.08);
          border: 1px solid rgba(180,100,255,0.25);
          border-radius: 12px;
          padding: 16px 32px;
        }
        .game-room-code-label {
          font-size: 10px;
          letter-spacing: 4px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .game-room-code {
          font-size: 32px;
          font-weight: 900;
          color: #fff;
          letter-spacing: 8px;
          font-family: monospace;
        }
        .game-room-share-label {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1px;
        }
        .game-room-share-row {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 8px 12px;
          width: 100%;
          box-sizing: border-box;
        }
        .game-room-share-url {
          flex: 1;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
        }
        .game-room-copy-btn {
          background: rgba(180,100,255,0.2);
          border: 1px solid rgba(180,100,255,0.4);
          border-radius: 6px;
          color: rgba(180,100,255,0.9);
          font-size: 11px;
          letter-spacing: 1px;
          padding: 4px 10px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s ease;
        }
        .game-room-copy-btn:hover {
          background: rgba(180,100,255,0.35);
        }
        .game-room-back-btn {
          background: rgba(180,100,255,0.15);
          border: 1px solid rgba(180,100,255,0.3);
          border-radius: 8px;
          color: rgba(180,100,255,0.85);
          font-size: 13px;
          padding: 10px 24px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .game-room-back-btn:hover {
          background: rgba(180,100,255,0.28);
        }
        .game-room-solo-link {
          background: none;
          border: none;
          color: rgba(255,255,255,0.2);
          font-size: 11px;
          cursor: pointer;
          letter-spacing: 1px;
          margin-top: 4px;
          padding: 4px 0;
          transition: color 0.15s ease;
        }
        .game-room-solo-link:hover {
          color: rgba(255,255,255,0.45);
        }
      `}</style>
    </>
  );
}
