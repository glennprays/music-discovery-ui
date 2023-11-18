import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/header/navigation";

const fontFamily = Poppins({
    weight: ["100", "200", "400", "500", "600", "700", "800", "900", "300"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Music Discovery | dengerin.",
    description: "Application to discover music by hearing it!",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={fontFamily.className}>
                <div className="bg-white min-h-screen w-full overflow-x-hidden">
                    <Navigation />
                    {children}
                </div>
            </body>
        </html>
    );
}
