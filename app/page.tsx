"use client";
import { CircleGauge, Mountain, Radar } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const Map = useMemo(
    () =>
      dynamic(() => import("./map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  const [posix, setPosix] = useState<[number, number]>([51.4, 14.29003]);
  const [flights, setFlights] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/flights", {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();
      setFlights(data.data);
    };

    fetchData();
    const interval = setInterval(fetchData, 1000); // Refetch every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);
  return (
    <>
      <div className="bg-white-700   w-[100%] h-[100vh] rounded-lg shadow-lg">
        <Map flights={flights} posix={posix} />
        <div className="absolute top-0 right-5 z-[10000] h-full py-10  w-[20em]">
          <div className=" max-h-full h-full rounded-lg">
            {/* Header */}
            <div className="border-b p-4 flex h-[4em] border rounded-t-lg bg-[rgb(8,8,8)]  gap-x-4 items-center border-white/20">
              <Radar className="text-white" />
              <h1 className="uppercase font-semibold">Active Flights</h1>
            </div>
            {/* Flights */}
            <div className="max-h-[90%] rounded-b-lg bg-[rgb(8,8,8)] border-x border-b border-white/20 overflow-auto">
              {flights.map((flight: string[], index) => {
                return (
                  <div
                    onClick={() => {
                      setPosix([parseFloat(flight[7]), parseFloat(flight[8])]);
                    }}
                    key={flight[4]}
                    className={`p-4 ${index !== flights.length - 1 && "border-b"} hover:bg-white/10 cursor-pointer border-white/20 flex flex-col gap-x-4 justify-center`}
                  >
                    <h1 className="text-white font-semibold">{flight[4]}</h1>
                    <div className="flex gap-x-2">
                      <p className="text-sm text-gray-400 flex items-center gap-x-2">
                        <CircleGauge size={17} className="inline" />
                        {flight[9]} knt
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-x-2">
                        <Mountain size={17} className="inline" />
                        {flight[5]} ft
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
