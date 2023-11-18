import React, { useEffect, useState, useRef } from "react";

export function ShowMusic({ audioBlob }: { audioBlob: Blob | undefined }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>();

    const handleUpload = async () => {
        if (audioBlob) {
            try {
                console.log("Recording audio...");

                const formData = new FormData();
                formData.append("audio", audioBlob, `audio.${audioBlob.type.split("/")[1]}`);

                const response = await fetch("/api/music/search", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setApiResponse(data.message); // Update with the appropriate response handling
                } else {
                    setApiResponse("Error uploading audio");
                }
            } catch (error) {
                console.error("Error uploading audio:", error);
                setApiResponse("Error uploading audio");
            }
        }
    };

    useEffect(() => {
        if (audioBlob) {
            // Create a URL for the Blob
            const audioUrl = URL.createObjectURL(audioBlob);
            setUrl(audioUrl);

            // Play the audio
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.play();
            }

            // Cleanup the URL when component unmounts
            return () => {
                URL.revokeObjectURL(audioUrl);
            };
        }
    }, [audioBlob]);

    return (
        <div>
            {audioBlob ? (
                <div>
                    <p>Success...</p>
                    <audio controls ref={audioRef} />
                    <button onClick={handleUpload}>Upload Audio</button>
                    {apiResponse && <p>{apiResponse}</p>}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
