"use client";
import React from "react";
import TextEditor from "./reusable/TextEditor";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
// import CommentList from "./CommentList";
// import { saveComment } from "../lib/saveComment";

const CommentSection = () => {
    const { user } = useAuth();

    const handleSaveComment = async (content: string) => {
        // await saveComment(content);
        console.log("content", content);
        if (!content.trim()) {
            toast.error("Please enter a comment");
        }

        try {
            // let fileURL = '';
            // if (file) {
            //   const base64 = await convertToBase64(file);
            //   const response = await axios.post('/api/upload', {
            //     file: base64,
            //     filename: file.name,
            //     filetype: file.type,
            //   });
            //   fileURL = response.data.url;
            // }

            await axios.post("/api/comment", {
                content,
                userName: user?.displayName,
                userPhoto: user?.photoURL,
                userId: user?.uid,
            });

            // setText('');
            // setFile(null);
            // onCommentAdded();
            toast.success("comment created");
        } catch (error) {
            console.error(error);
            // handle error (show toast or alert)
            toast.error("Comment to created");
        }
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
