import { CircularProgress } from "@nextui-org/react";

export default function LoadingScreen() {
    return (
        <div className="h-[calc(100vh-150px)] w-full flex items-center justify-center bg-gradient-to-tr from-pink-500/20 to-yellow-500/20 dark:from-pink-500/10 dark:to-yellow-500/10">
            <div className="flex flex-col items-center gap-4">
                <CircularProgress
                    size="lg"
                    classNames={{
                        track: "text-pink-500",
                        indicator: "text-yellow-500",
                    }}
                />
                <p className="text-xl font-semibold bg-gradient-to-tr from-pink-500 to-yellow-500 bg-clip-text text-transparent"
                    style={{ fontFamily: "'Newsreader', serif" }}>
                    Loading Maps...
                </p>
            </div>
        </div>
    );
}