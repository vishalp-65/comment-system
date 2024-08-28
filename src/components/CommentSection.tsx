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
    const [sortBy, setSortBy] = useState("createdAt");

    // Fetch comments on component mount
    useEffect(() => {
        fetchComments(sortBy);
    }, []);

    const fetchComments = async (sortBy: String) => {
        try {
            const { data } = await axios.get(`/api/comment?sortBy=${sortBy}`);
            setComments(data.comments);
            console.log("comment data", comments);
        } catch (error) {
            toast.error("Failed to load comments");
        } finally {
            setIsLoading(false); // Ensure loading is set to false after fetching
        }
    };

    const handleSaveComment = async (content: string, fileURL?: string) => {
        if (!content.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        try {
            await axios.post("/api/comment", {
                content,
                fileURL: fileURL || "",
                userName: user?.displayName,
                userPhoto: user?.photoURL,
                userId: user?.uid,
            });

            toast.success("Comment created");
            fetchComments(sortBy); // Refetch comments after adding a new one
        } catch (error) {
            toast.error("Failed to create comment");
        }
    };

    useEffect(() => {
        fetchComments(sortBy);
    }, [sortBy]);

    return (
        <div className="commentShadow border py-8 px-8 md:px-10">
            <div className="flex items-center justify-between px-2 flex-wrap">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Comments ({comments.length})
                </h1>
                <div className="flex items-center justify-between rounded-md border border-gray-300">
                    <p
                        className={`px-2 py-1.5 cursor-pointer ${
                            sortBy === "createdAt"
                                ? "bg-slate-200 text-black font-semibold"
                                : ""
                        }`}
                        onClick={() => setSortBy("createdAt")}
                    >
                        Latest
                    </p>
                    <p
                        className={`py-1.5 px-2 cursor-pointer ${
                            sortBy === "popular"
                                ? "bg-slate-200 text-black font-semibold"
                                : ""
                        }`}
                        onClick={() => setSortBy("popular")}
                    >
                        Popular
                    </p>
                </div>
            </div>

            <div className="my-4">
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
