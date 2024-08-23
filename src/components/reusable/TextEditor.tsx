"use client";
import React, { useRef, useState } from "react";
import { ImAttachment } from "react-icons/im";

interface FormatType {
    bold: boolean;
    italic: boolean;
    underline: boolean;
}

const TextEditor = ({ onSave }: { onSave: (content: string) => void }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [activeFormat, setActiveFormat] = useState<FormatType>({
        bold: false,
        italic: false,
        underline: false,
    });

    const applyStyle = (command: string, value: string | null = null) => {
        if (editorRef.current) {
            document.execCommand(command, false, value!);
        }
    };

    const handleFormat = (formatField: keyof FormatType) => {
        applyStyle(formatField);
        setActiveFormat((prevFormat) => ({
            ...prevFormat,
            [formatField]: !prevFormat[formatField],
        }));
    };

    const handleSave = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            onSave(content);
            editorRef.current.innerHTML = ""; // Clear editor after saving
            setActiveFormat({
                bold: false,
                italic: false,
                underline: false,
            });
        }
    };

    return (
        <div className="rounded-2xl border-2 border-gray-300 p-5">
            {/* Text area */}
            <div
                ref={editorRef}
                contentEditable
                className="p-2 min-h-20 outline-none"
                style={{ whiteSpace: "pre-wrap" }}
            ></div>

            {/* Separator */}
            <div className="border border-b border-gray-400 w-full"></div>

            {/* Text format buttons */}
            <div className="flex items-start justify-between mt-2">
                <div className="mt-3 flex items-center gap-1.5 justify-start">
                    <button
                        onClick={() => handleFormat("bold")}
                        className={`px-2 py-1 font-semibold text-gray-500 ${
                            activeFormat.bold
                                ? "bg-gray-200/90 text-gray-950 rounded-md"
                                : ""
                        } `}
                    >
                        B
                    </button>
                    <button
                        onClick={() => handleFormat("italic")}
                        className={`px-2 py-1 font-semibold text-gray-500 ${
                            activeFormat.italic
                                ? "bg-gray-200/90 text-gray-950 rounded-md"
                                : ""
                        } `}
                    >
                        <i>I</i>
                    </button>
                    <button
                        onClick={() => handleFormat("underline")}
                        className={`px-2 py-1 font-semibold text-gray-500 ${
                            activeFormat.underline
                                ? "bg-gray-200/90 text-gray-950 rounded-md"
                                : ""
                        } `}
                    >
                        <u>U</u>
                    </button>
                    <button
                        onClick={() => {
                            const url = prompt("Enter the URL");
                            if (url) applyStyle("createLink", url);
                        }}
                        className="px-2 py-1 font-semibold text-gray-500"
                    >
                        Link
                    </button>
                    <ImAttachment />
                </div>

                {/* Save button */}
                <button
                    onClick={handleSave}
                    className="p-3 mt-2 bg-black/90 h-full text-white rounded-md"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default TextEditor;
