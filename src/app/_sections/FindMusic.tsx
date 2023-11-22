"use client"
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { BsMic } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";

export function FindMusic({
    setAudioBlob,
}: {
    setAudioBlob: Dispatch<SetStateAction<Blob | undefined>>;
}) {
    const [finding, setFinding] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const findingTime = 10 

    function startHearing() {
        if (!finding) {
            console.log("recording start");
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                    const mediaRecorder = new MediaRecorder(stream);

                    mediaRecorder.start();
                    setFinding(true);
                    mediaRecorderRef.current = mediaRecorder;

                    timeoutRef.current = setTimeout(() => {
                        console.log("stopped");
                        stopHearing();
                    }, (findingTime+1)*1000);
                })
                .catch((error) => {
                    console.error("Error accessing microphone:", error);
                });
        }
    }

    function cancelHearing() {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setAudioBlob(undefined);
        setFinding(false);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    function stopHearing() {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    const audioBlob = new Blob([event.data], {
                        type: event.data.type,
                    });
                    setAudioBlob(audioBlob);
                    setFinding(false);
                }
            };
        } else {
            console.error("Media Recorder Error!");
        }
    }

    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
            }

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="flex flex-col justify-center items-center gap-5 w-full h-[75vh] relative">
            {finding && (
                <span
                    onClick={cancelHearing}
                    className="absolute left-0 text-[30px] text-red-600 top-8"
                >
                    <GiCancel />
                </span>
            )}
            <span>
                {finding ? "Hearing the song..." : "Tap to find song..."}
            </span>
            <div className="relative flex items-center justify-center">
                {finding && (
                    <div className="bg-[#84e2ff] rounded-full absolute w-[120px] h-[120px] motion-safe:animate-ping"></div>
                )}
                <div
                    onClick={finding ? cancelHearing : startHearing}
                    className={`bg-[#0088FF] p-14 rounded-full flex items-center justify-center w-fit relative 
            ${finding ? "" : "hover:scale-105 transition-transform"}`}
                >
                    {finding ? (
                        <span className="text-[70px] text-white">
                            <BsMic />
                        </span>
                    ) : (
                        <Image
                            src="/findme-logo-white.svg"
                            alt="find"
                            width={70}
                            height={70}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
