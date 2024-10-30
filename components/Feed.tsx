"use client";

import { useState, useEffect } from "react";
import { Pagination, PaginationItemRenderProps, PaginationItemType } from "@nextui-org/react";
import { cn } from "@nextui-org/react";

export default function Feed() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderContent = () => {
        switch (currentPage) {
            case 1:
                return (
                    <p className="h-full">
                        Don't Have A Ride?<br />
                        If you are seeking an alternative mode of transportation around town, back home for a weekend or break, and even for short trips to Butler Plaza consider reserving a Zipcar. For more information, visit the Zipcar section under the Alternative Transportation tab.
                    </p>

                );
            case 2:
                return <p>Content for Page 2</p>;
            case 3:
                return <p>Content for Page 3</p>;
            case 4:
                return <p>Content for Page 4</p>;
            case 5:
                return <p>Content for Page 5</p>;
            default:
                return <p>No content available for this page</p>;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPage((prevPage) => (prevPage % totalPages) + 1);
        }, 5000000);

        return () => clearInterval(interval);
    }, []);

    const renderItem = ({
        ref,
        key,
        value,
        isActive,
        onNext,
        onPrevious,
        setPage,
        className,
    }: PaginationItemRenderProps) => {
        if (value === PaginationItemType.NEXT) {
            return (
                <button key={key} className={className} onClick={onNext}>
                    &gt;
                </button>
            );
        }

        if (value === PaginationItemType.PREV) {
            return (
                <button key={key} className={className} onClick={onPrevious}>
                    &lt;
                </button>
            );
        }

        const customClass = value === 2 && !isActive ? "bg-warning text-white" : "";

        return (
            <button
                ref={ref}
                key={key}
                className={cn(className, customClass, isActive && "font-bold")}
                onClick={() => {
                    if (typeof value === 'number') {
                        setPage(value);
                    }
                }}
            >
                {value}
            </button>
        );
    };

    return (
        <div className="flex flex-col items-center space-y-4 h-full p-2 w-full bg-red-300">
            <div className="flex-grow flex flex-col items-center bg-gray-200 w-full h-full p-1">
                {renderContent()}
                <Pagination
                    loop
                    showControls
                    color="primary"
                    total={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    className="z-10 relative bottom-1"
                    renderItem={renderItem}
                />
            </div>
        </div>
    );
}
