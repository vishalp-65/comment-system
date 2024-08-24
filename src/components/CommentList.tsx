"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import TextEditor from "./reusable/TextEditor";
import { useAuth } from "@/context/AuthContext";
import CommentCard from "./reusable/CommentCard";
import toast from "react-hot-toast";

interface Comment {
    id: string;
    content: string;
    userId: string;
    userName: string;
    fileURL: string;
    userPhoto: string;
    createdAt: { seconds: number; nanoseconds: number };
    replies: Comment[];
}

const CommentsList = () => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const { data } = await axios.get("/api/comment");
                setComments(data.comments);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            }
        };

        fetchComments();
    }, []);

    const handleReply = async (content: string, commentId: string) => {
        if (!content) return;
        console.log("reply", content);

        try {
            await axios.post(`/api/comment/${commentId}/reply`, {
                content: content,
                userId: user?.uid,
                userName: user?.displayName,
                userPhoto: user?.photoURL,
            });
            setActiveCommentId(null);
            const { data } = await axios.get("/api/comment"); // Refresh comments
            setComments(data.comments);

            toast.success("Successfully replied");
        } catch (error) {
            console.error("Failed to post reply", error);
            toast.error("Unable to reply");
        }
    };

    const handleCancelReply = () => {
        setActiveCommentId(null); // Hide TextEditor
    };

    return (
        <div>
            {comments.map((comment) => (
                <div key={comment.id}>
                    <CommentCard
                        comment={comment}
                        onReply={() => setActiveCommentId(comment.id)}
                    />
                    {activeCommentId === comment.id && (
                        <div className="ml-8 mt-2">
                            <TextEditor
                                onSave={(content) =>
                                    handleReply(content, comment.id)
                                }
                                onCancel={handleCancelReply}
                                isReply={true}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CommentsList;
