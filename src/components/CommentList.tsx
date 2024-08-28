"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import TextEditor from "./reusable/TextEditor";
import { useAuth } from "@/context/AuthContext";
import CommentCard from "./reusable/CommentCard";
import toast from "react-hot-toast";

interface CommentListProps {
    comments: any;
    fetchComments: (sortBy: string) => void;
}

const CommentsList = ({ comments, fetchComments }: CommentListProps) => {
    const { user } = useAuth();

    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

    const handleReply = async (
        content: string,
        commentId: string,
        fileURL?: string
    ) => {
        if (!content) return;

        try {
            await axios.post(`/api/comment/${commentId}/reply`, {
                content: content,
                userId: user?.uid,
                fileURL: fileURL || "",
                userName: user?.displayName,
                userPhoto: user?.photoURL,
            });
            setActiveCommentId(null);
            fetchComments("createdAt");

            toast.success("Successfully replied");
        } catch (error) {
            console.error("Failed to post reply", error);
            toast.error("Unable to reply");
        }
    };

    const handleCancelReply = () => {
        setActiveCommentId(null); // Hide TextEditor
    };

    const onReact = async (
        emoji: string,
        commentId: string,
        isReply: boolean
    ) => {
        if (!user) {
            toast.error("Please login for reaction and comment");
            return;
        }
        if (!commentId || !emoji) {
            toast.error("Invalid comment ID or emoji");
            return;
        }

        try {
            const res = await axios.post(
                `api/comment/${commentId}/reactions?isReply=${isReply}`,
                {
                    userId: user?.uid,
                    emoji: emoji,
                }
            );
            fetchComments("createdAt");
        } catch (error) {
            console.log("error", error);
            toast.error("Reaction not added");
        }
    };

    // useEffect(() => {
    //     fetchComments();
    // }, []);

    return (
        <div>
            {comments.length !== 0 ? (
                comments.map((comment: any) => (
                    <div key={comment.id}>
                        <CommentCard
                            comment={comment}
                            onReply={() => setActiveCommentId(comment.id)}
                            onReact={onReact}
                        />
                        {activeCommentId === comment.id && (
                            <div className="ml-8 mt-2">
                                <TextEditor
                                    onSave={(content, fileURL) =>
                                        handleReply(
                                            content,
                                            comment.id,
                                            fileURL
                                        )
                                    }
                                    onCancel={handleCancelReply}
                                    isReply={true}
                                />
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="flex items-center justify-center mt-14 mb-10 text-gray-500">
                    <p>No comments found</p>
                </div>
            )}
        </div>
    );
};

export default CommentsList;
