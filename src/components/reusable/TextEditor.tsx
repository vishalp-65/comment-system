"use client";
import { useAuth } from "@/context/AuthContext";
import React, { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ImAttachment } from "react-icons/im";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

interface FormatType {
    bold: boolean;
    italic: boolean;
    underline: boolean;
}

const TextEditor = ({
    onSave,
    onCancel,
    isReply = false,
}: {
    onSave: (content: string, fileURL?: string) => void;
    onCancel: () => void;
    isReply: boolean;
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [activeFormat, setActiveFormat] = useState<FormatType>({
        bold: false,
        italic: false,
        underline: false,
    });
    const { user } = useAuth();
    const [fileURL, setFileURL] = useState<string | null>(null);
    const [charCount, setCharCount] = useState<number>(0);
    const [toastShown, setToastShown] = useState<boolean>(false);

    const handleInput = (e: any) => {
        if (editorRef.current) {
            const text = editorRef.current.innerText;

            if (text.length > 250) {
                if (!toastShown) {
                    setToastShown(true); // Ensure the toast is shown only once
                }
            } else {
                setCharCount(text.length);
                setToastShown(false); // Reset toast visibility state if within limit
            }
        }
    };

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) {
            toast.error("Please login for comment");
            return;
        }
        const file = e.target.files?.[0];
        if (!file) return;

        const storage = getStorage();
        const storageRef = ref(storage, `comments/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Create a toast ID for updating progress
        const toastId = toast.loading("Uploading image...");

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Calculate upload progress percentage
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                // Update the toast with the progress percentage
                toast.loading(`Uploading: ${Math.round(progress)}%`, {
                    id: toastId,
                });
            },
            (error) => {
                toast.error("Image upload failed", { id: toastId });
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFileURL(downloadURL);
                    toast.success("Image uploaded successfully", {
                        id: toastId,
                    });
                });
            }
        );
    };

    const handleSave = () => {
        if (!user) {
            toast.error("Please login to create a comment");
            return;
        }
        // Calculate the content length directly if charCount might be outdated
        const contentLength = editorRef.current
            ? editorRef.current.innerText.length
            : 0;

        if (contentLength > 250) {
            toast.error("Comment should be under 250 characters");
            return;
        }
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            onSave(content, fileURL || undefined);
            editorRef.current.innerHTML = ""; // Clear editor after saving
            setActiveFormat({
                bold: false,
                italic: false,
                underline: false,
            });
            setFileURL(null); // Reset file URL after saving
            setCharCount(0); // Reset character count after saving
            setToastShown(false); // Reset toast visibility state
        }
    };

    const handleCancel = () => {
        if (editorRef.current) {
            editorRef.current.innerHTML = ""; // Clear editor on cancel
            setCharCount(0); // Reset character count on cancel
            setToastShown(false); // Reset toast visibility state
        }
        onCancel(); // Hide TextEditor
    };

    useEffect(() => {
        const editorElement = editorRef.current;
        if (editorElement) {
            editorElement.addEventListener("input", handleInput);

            // Clean up the event listener on component unmount
            return () => {
                editorElement.removeEventListener("input", handleInput);
            };
        }
    }, []);

    return (
        <div className="flex items-start min-h-52 gap-4">
            {isReply && (
                <div className="border border-l-4 min-h-48 h-auto border-gray-400/80"></div>
            )}
            <div className="rounded-2xl border-2 border-gray-300 p-5 w-full">
                {/* Text area */}
                <div
                    ref={editorRef}
                    contentEditable
                    className="p-2 min-h-20 outline-none"
                    style={{ whiteSpace: "pre-wrap" }}
                ></div>

                {/* Character Count */}
                <div
                    className={`text-right text-gray-500 text-sm ${
                        toastShown ? "text-red-600 font-semibold" : ""
                    }`}
                >
                    {charCount}/250
                </div>

                {/* Separator */}
                <div className="border border-b border-gray-400 w-full"></div>

                {fileURL && (
                    <div className="relative w-fit mt-3 h-fit rounded-md">
                        <Image
                            src={fileURL}
                            alt="Uploaded file"
                            width={100}
                            height={100}
                            className="rounded-md w-auto h-auto"
                        />
                        <div
                            className="absolute -top-2 -right-2 bg-gray-300 rounded-full p-0.5 cursor-pointer"
                            onClick={() => setFileURL("")}
                        >
                            <IoClose />
                        </div>
                    </div>
                )}

                {/* Text format buttons */}
                <div className="flex items-start justify-between mt-2">
                    <div className="mt-3 text-lg flex items-center gap-1.5 justify-start">
                        <button
                            onClick={() => handleFormat("bold")}
                            className={`px-2 py-1 font-semibold text-gray-500 hover:text-black hover:scale-110 hover:bg-gray-100 hover:rounded-md ${
                                activeFormat.bold
                                    ? "bg-gray-200/90 text-gray-950 rounded-md"
                                    : ""
                            } `}
                        >
                            B
                        </button>
                        <button
                            onClick={() => handleFormat("italic")}
                            className={`px-3 py-1 font-semibold text-gray-500 hover:text-black hover:scale-110 hover:bg-gray-100 hover:rounded-md ${
                                activeFormat.italic
                                    ? "bg-gray-200/90 text-gray-950 rounded-md"
                                    : ""
                            } `}
                        >
                            <i>I</i>
                        </button>
                        <button
                            onClick={() => handleFormat("underline")}
                            className={`px-2 py-1 font-semibold text-gray-500 hover:text-black hover:scale-110 hover:bg-gray-100 hover:rounded-md ${
                                activeFormat.underline
                                    ? "bg-gray-200/90 text-gray-950 rounded-md"
                                    : ""
                            } `}
                        >
                            <u>U</u>
                        </button>

                        <label className="text-gray-500 hover:text-black hover:scale-110 hover:bg-gray-100 hover:rounded-md px-2 py-1 font-semibold cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <ImAttachment />
                        </label>
                    </div>

                    {/* Save and Cancel buttons */}
                    <div>
                        {isReply && (
                            <button
                                onClick={handleCancel}
                                className="p-3 mt-2 border border-gray-400 text-black h-full rounded-md mr-2"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            className="p-3 mt-2 bg-black/90 h-full text-white rounded-md"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextEditor;
