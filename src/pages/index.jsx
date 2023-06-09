import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import Head from "next/head";

const socket = io("http://localhost:5000");

function useCursorOffset() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let timeoutId;

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (clientX - centerX) / centerX;
      const offsetY = (-clientY + centerY) / centerY;

      clearTimeout(timeoutId);

      setOffset({ x: offsetX, y: offsetY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  });

  return offset;
}

function AudioPlayer({ isPlaying }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = new Audio("/SireneMeme.mp3");
    if (isPlaying) {
      if (!isLoaded) {
        audio.load();
        setIsLoaded(true);
      }
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  return <></>;
}

export default function Home() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [alarmTime, setAlarmTime] = useState("");
  const cursorOffset = useCursorOffset();

  const currentHour = time.split(":")[0];
  const currentMinute = time.split(":")[1];

  useEffect(() => {
    socket.on("data", (data) => {
      const currentTime = Date.now();
      if (currentTime - 1000 > 0) {
        console.log(data.time);
        setTime(data.time);
        setDate(data.date);
        setAlarmTime(data.alarm);
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>OLED CLIENT WEB BY AHMAD ZAKI AKMAL</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center font-mono bg-slate-300">
        <h1 className="absolute bottom-0 right-0 font-bold text-black p-2">
          OLED CLIENT WEB BY AHMAD ZAKI AKMAL
        </h1>
        <div
          className="oled relative bg-[#0F4D7C] w-[80%] max-w-[800px] px-0 pt-[110px] pb-[85px] grid place-items-center rounded-[8px]"
          style={{
            transform: `rotateY(${cursorOffset.x * 30}deg) rotateX(${
              cursorOffset.y * 25
            }deg)`,
          }}
        >
          <div className="screen outline outline-white outline-offset-[5px] bg-black w-[96%] aspect-[320/175] flex flex-col justify-center items-center">
            {time != "" && date != "" ? (
              <>
                <h1 className="text-[40px] md:text-[60px] text-center drop-shadow-[0_0_5px_rgba(255,255,255,.6)]">
                  {time}
                </h1>
                <h1 className="text-[20px] md:text-[30px] text-center drop-shadow-[0_0_5px_rgba(255,255,255,.6)] mt-[-14px]">
                  {date}
                </h1>
              </>
            ) : (
              <h1 className="text-[20px] md:text-[30px] text-center drop-shadow-[0_0_5px_rgba(255,255,255,.6)] mt-[-14px]">
                Waiting for data...
              </h1>
            )}
            {alarmTime != "" ? (
              <h1 className="text-[20px] md:text-[30px] text-center drop-shadow-[0_0_5px_rgba(255,255,255,.6)] mt-[20px]">
                alarm on{" "}
                {alarmTime.hour}:{alarmTime.minute}
              </h1>
            ) : (
              ""
            )}
          </div>
          {/* //? Decorations */}
          <div className="bg-white w-[100px] h-[60px] absolute top-0 left-0 m-5 rounded-full border-slate-400 border-[10px]"></div>
          <div className="bg-white w-[100px] h-[60px] absolute top-0 right-0 m-5 rounded-full border-slate-400 border-[10px]"></div>
          <div className="bg-white w-[100px] h-[60px] absolute bottom-0 right-0 mx-5 mb-3 rounded-full border-slate-400 border-[10px]"></div>
          <div className="bg-white w-[100px] h-[60px] absolute bottom-0 left-0 mx-5 mb-3 rounded-full border-slate-400 border-[10px]"></div>
          <div className="bg-slate-900 rounded-t-[30px] absolute bottom-0 h-[90px] w-[250px]"></div>
          <div className="absolute top-0 flex mt-10 gap-[30px] outline-white outline outline-1 outline-offset-8 px-2">
            <div className="relative grid place-items-center bg-slate-400 w-[30px] rounded-full aspect-square border-[3px] border-slate-200">
              <h1 className="absolute bottom-[-30px]">VCC</h1>
            </div>
            <div className="relative grid place-items-center bg-slate-400 w-[30px] rounded-full aspect-square border-[3px] border-slate-200">
              <h1 className="absolute bottom-[-30px]">GND</h1>
            </div>
            <div className="relative grid place-items-center bg-slate-400 w-[30px] rounded-full aspect-square border-[3px] border-slate-200">
              <h1 className="absolute bottom-[-30px]">SCL</h1>
            </div>
            <div className="relative grid place-items-center bg-slate-400 w-[30px] rounded-full aspect-square border-[3px] border-slate-200">
              <h1 className="absolute bottom-[-30px]">SDA</h1>
            </div>
          </div>
          <div className="bg-green-700/[.8] w-[80px] h-[80px] absolute top-0 right-0 mt-[110px] translate-x-[62px]"></div>
          {/* <div className="layer h-full bg-[red] absolute w-full"></div> */}
          {/* //? AudioPlayer */}
          <AudioPlayer
            isPlaying={
              alarmTime.hour == currentHour && alarmTime.minute == currentMinute
            }
          />
        </div>
      </main>
    </>
  );
}
