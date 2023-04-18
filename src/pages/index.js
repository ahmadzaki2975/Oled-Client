import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://localhost:5000");

export default function Home() {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    socket.on("data", (data) => {
      const currentTime = Date.now();
      // console.log(data.body.time);
      if (currentTime - 1000 > 0) {
        setDisplayText(data.body.time);
      }
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-4xl">
      {displayText}
    </main>
  );
}
