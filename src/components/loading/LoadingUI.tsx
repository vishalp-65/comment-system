import React from "react";
import { FaRegCommentAlt } from "react-icons/fa";

type Props = {};

const LoadingUI = (props: Props) => {
    return (
        <div
            className="flex items-center justify-center absolute inset-0 
            backdrop-blur-sm bg-white/50 transition"
        >
            <div className="animate-pulse text-center flex flex-col gap-2 items-center justify-center">
                <FaRegCommentAlt className="text-4xl text-gray-600 mr-2" />
                <p className="text-2xl">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingUI;
