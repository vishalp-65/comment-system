"use client";
import React, { useEffect, useState } from "react";
import TextEditor from "./reusable/TextEditor";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import CommentsList from "./CommentList";
import { Comment } from "@/types/comment";
import LoadingUI from "./loading/LoadingUI";

const CommentSection = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(true); // Set to true initially to show loader on mount
    const [comments, setComments] = useState<Comment[]>([]);

    // Fetch comments on component mount
    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const { data } = await axios.get("/api/comment");
            setComments(data.comments);
            console.log("comment data", comments);
        } catch (error) {
            console.error("Failed to fetch comments", error);
            toast.error("Failed to load comments");
        } finally {
            setIsLoading(false); // Ensure loading is set to false after fetching
        }
    };

    const handleSaveComment = async (content: string) => {
        if (!content.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        try {
            await axios.post("/api/comment", {
                content,
                userName: user?.displayName,
                userPhoto: user?.photoURL,
                userId: user?.uid,
            });

            toast.success("Comment created");
            fetchComments(); // Refetch comments after adding a new one
        } catch (error) {
            console.error("Failed to create comment", error);
            toast.error("Failed to create comment");
        }
    };

    return (
        <div className="commentShadow border py-5 px-7">
            <div className="flex items-center justify-between px-2">
                <h1 className="text-2xl font-bold mb-4">
                    Comments ({comments.length})
                </h1>
                <div className="flex items-center justify-between rounded-md gap-3 border border-gray-300">
                    <p className="bg-slate-200 px-2 py-1.5 cursor-pointer">
                        Latest
                    </p>
                    <p className="py-1.5 pr-2 cursor-pointer">Popular</p>
                </div>
            </div>

            <div className="my-5">
                <TextEditor
                    onSave={handleSaveComment}
                    isReply={false}
                    onCancel={() => {}}
                />
            </div>

            {isLoading ? (
                <LoadingUI />
            ) : (
                <CommentsList
                    fetchComments={fetchComments}
                    comments={comments}
                />
            )}
        </div>
    );
};

export default CommentSection;
