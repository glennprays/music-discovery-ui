import Image from "next/image";

export function Navigation() {
    return (
        <nav className="bg-white border-b-2 border-neutral-200 py-5 px-8 w-full flex items-center shadow-sm">
            <div className="font-bold text-2xl flex text-[#0088FF] gap-2">
                <Image
                    src="findme-logo.svg"
                    alt="Findme Logo"
                    width={25}
                    height={25}
                />
                dengerin.
            </div>
        </nav>
    );
}
