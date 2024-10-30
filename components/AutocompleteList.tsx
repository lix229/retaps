"use client";

import { useState, useRef } from "react";
import { Input } from "@nextui-org/react";

interface AutocompleteListProps {
    onSelect: (value: string) => void;
}

const AutocompleteList: React.FC<AutocompleteListProps> = ({ onSelect }) => {
    const [query, setQuery] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showNoResults, setShowNoResults] = useState(false);
    const inputContainerRef = useRef<HTMLDivElement>(null);

    const suggestions = ["DSIT", "Reitz Union"];

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setQuery(input);

        if (input.trim() === "") {
            setFilteredSuggestions([]);
            setShowNoResults(false);
        } else {
            const matches = suggestions.filter((item) =>
                item.toLowerCase().includes(input.toLowerCase())
            );
            setFilteredSuggestions(matches);
            setShowNoResults(matches.length === 0);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setFilteredSuggestions([]);
        setShowNoResults(false);
        onSelect(suggestion);
    };

    return (
        <div ref={inputContainerRef} className="relative w-[300px] rounded-[11px] shadow-medium">
            <Input
                type="search"
                label="Destination"
                value={query}
                onChange={handleInputChange}
                aria-label="Search input"
                className="w-full"
            />

            {query && filteredSuggestions.length > 0 && (
                <div
                    className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10"
                    style={{ fontFamily: "var(--nextui-font-sans)" }}
                >
                    {filteredSuggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}

            {query && showNoResults && filteredSuggestions.length === 0 && (
                <div className="absolute top-full left-0 w-full mt-1 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-md text-center text-gray-500 dark:text-gray-400 z-10">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">
                        No results for "{query}"
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Try adding more characters to your search term.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AutocompleteList;
