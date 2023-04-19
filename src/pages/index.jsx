import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://localhost:5000");

export default function Home() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    socket.on("data", (data) => {
      const currentTime = Date.now();
      if (currentTime - 1000 > 0) {
        console.log(data.time);
        setTime(data.time);
        setDate(data.date);
      }
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center font-mono bg-white">
      <div className="relative bg-[#0F4D7C] aspect-[320/175] w-[80%] px-0 pt-[110px] pb-[85px] grid place-items-center rounded-[8px]">
        <div className="bg-black w-[96%] aspect-[320/175] rounded-[5px] flex flex-col justify-center items-center">
          <h1 className="text-[40px] md:text-[60px] text-center">{time}</h1>
          <h1 className="text-[20px] md:text-[30px] text-center">{date}</h1>
        </div>
        {/* //? Decorations */}
        <div className="bg-white w-[100px] h-[60px] absolute top-0 left-0 m-5 rounded-full border-slate-400 border-[10px]"></div>
        <div className="bg-white w-[100px] h-[60px] absolute top-0 right-0 m-5 rounded-full border-slate-400 border-[10px]"></div>
        <div className="bg-white w-[100px] h-[60px] absolute bottom-0 right-0 mx-5 mb-3 rounded-full border-slate-400 border-[10px]"></div>
        <div className="bg-white w-[100px] h-[60px] absolute bottom-0 left-0 mx-5 mb-3 rounded-full border-slate-400 border-[10px]"></div>
        <div className="bg-slate-900 absolute bottom-0 h-[90px] w-[250px]"></div>
        <div className="absolute top-0 flex mt-10 gap-[30px]">
          <div className="bg-slate-400 w-[30px] rounded-full aspect-square border-[3px] border-slate-200"></div>
          <div className="bg-slate-400 w-[30px] rounded-full aspect-square border-[3px] border-slate-200"></div>
          <div className="bg-slate-400 w-[30px] rounded-full aspect-square border-[3px] border-slate-200"></div>
          <div className="bg-slate-400 w-[30px] rounded-full aspect-square border-[3px] border-slate-200"></div>
        </div>
        <div className="bg-green-700 w-[80px] h-[80px] absolute top-0 right-0 mt-[110px] translate-x-[62px]"></div>
      </div>
    </main>
  );
}
