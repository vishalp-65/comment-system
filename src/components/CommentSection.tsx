"use client";
import React from "react";
import TextEditor from "./reusable/TextEditor";
// import CommentList from "./CommentList";
// import { saveComment } from "../lib/saveComment";

const CommentSection = () => {
    const handleSaveComment = async (content: string) => {
        // await saveComment(content);
        console.log("content", content);
    };

    return (
        <div className="commentShadow border py-5 px-7">
            <div className="flex items-center justify-between px-2">
                <h1 className="text-2xl font-bold mb-4">Comments(3)</h1>
                <div className="flex items-center justify-between rounded-md gap-3 border border-gray-300">
                    <p className="bg-slate-200 px-2 py-1.5 cursor-pointer">
                        Latest
                    </p>
                    <p className="py-1.5 pr-2 cursor-pointer">Popular</p>
                </div>
            </div>

            <div className="mt-5">
                <TextEditor onSave={handleSaveComment} />
            </div>
            {/* <CommentList /> */}
        </div>
    );
};

export default CommentSection;
