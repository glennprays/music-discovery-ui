"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";

type Thumbnail = {
    height: number;
    url: string;
    width: number;
};

type Artist = {
    id: string;
    name: string;
};

type Album = {
    id: string;
    name: string;
};

type FeedbackTokens = {
    add: string;
    remove: string;
};

type SearchResult = {
    album: Album;
    artists: Artist[];
    category: string;
    duration: string;
    duration_seconds: number;
    feedbackTokens: FeedbackTokens;
    inLibrary: boolean;
    isExplicit: boolean;
    resultType: string;
    thumbnails: Thumbnail[];
    title: string;
    videoId: string;
    videoType: string;
    year: null | number;
};

type MusicData = {
    filename: string;
    lyrics: string;
    search_result: SearchResult;
};

export function ShowMusic({ audioBlob }: { audioBlob: Blob | undefined }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [apiResponse, setApiResponse] = useState<MusicData | null>(null);
    const [url, setUrl] = useState<string | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async () => {
        if (audioBlob) {
            try {
                setLoading(true);

                console.log("Uploading audio...");

                const formData = new FormData();
                formData.append(
                    "audio",
                    audioBlob,
                    `audio.${audioBlob.type.split("/")[1].split(";")[0]}`
                );

                const response = await fetch("/api/music/search", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const data: MusicData = await response.json();
                    setApiResponse(data);
                } else {
                    throw new Error("Error uploading audio");
                }
            } catch (error) {
                console.error("Error uploading audio:", error);
                setError(
                    "Google Web Speech API could not understand the audio"
                );
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (audioBlob) {
            handleUpload();
        }
    }, [audioBlob]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <div>
                    <p>Error: {error}</p>
                    <button onClick={handleUpload}>Retry</button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {apiResponse ? (
                        <>
                            <span className="">
                                Detected lyrics:{" "}
                                <span className="italic">{apiResponse.lyrics}</span>
                            </span>
                            <div>
                                <Link
                                    href={`https://music.youtube.com/watch?v=${apiResponse.search_result.videoId}`}
                                    className="text-3xl text-sky-600"
                                >
                                    {apiResponse.search_result.title}
                                </Link>{" "}
                                -
                                <span>
                                    {apiResponse.search_result.artists[0].name}
                                </span>
                            </div>
                        </>
                    ) : (
                        "Success but No response data!"
                    )}
                </div>
            )}
        </div>
    );
}
