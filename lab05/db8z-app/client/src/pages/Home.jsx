import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleEnterRoom = () => {
    const roomId = prompt("Enter Room ID to join:");
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">🗣️ Debate Room</h1>
      <button
        onClick={handleEnterRoom}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Join a Room
      </button>
    </div>
  );
}

export default Home;
