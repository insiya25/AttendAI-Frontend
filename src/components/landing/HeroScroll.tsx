import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation"; // Adjust path as needed

export default function HeroScrollDemo() {
    return (
        <div className="flex flex-col overflow-hidden bg-white">
            <ContainerScroll
                titleComponent={
                    <>
                        <h1 className="text-4xl font-semibold text-gray-900">
                            Manage Attendance Smarter with <br />
                            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900">
                                AttendAI
                            </span>
                        </h1>
                    </>
                }
            >
                <video
                    src="/video.mp4"
                    height={720}
                    width={1400}
                    className="mx-auto rounded-2xl object-cover h-full object-left-top"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
            </ContainerScroll>
        </div>
    );
}