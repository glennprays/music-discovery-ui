"use client";
import { useState } from "react";
import { ShowMusic } from "./_sections/ShowMusic";
import dynamic from "next/dynamic";
import { FindMusic } from "./_sections/FindMusic";

export default function Home() {
    const [finding, setFinding] = useState(true);
    const [audioBlobUrl, setAudioBlobUrl] = useState<Blob | undefined>(
        undefined
    );
    return (
        <div className="px-8 py-5 w-full h-full">
            {audioBlobUrl === undefined ? (
                <FindMusic setAudioBlob={setAudioBlobUrl} />
            ) : (
                <ShowMusic audioBlob={audioBlobUrl} />
            )}
        </div>
    );
}
