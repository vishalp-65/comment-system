import { formatDate } from "@/utils/helper";
import Image from "next/image";
import React from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";

interface CommentCardProps {
    comment: {
        id: string;
        content: string;
        userId: string;
        userName: string;
        fileURL: string;
        userPhoto: string;
        createdAt: { seconds: number; nanoseconds: number };
        replies?: CommentCardProps["comment"][]; // Type for replies
    };
    onReply: () => void; // Function to handle reply button click
}

const CommentCard = ({ comment, onReply }: CommentCardProps) => {
    return (
        <div className="p-2 flex flex-col gap-3">
            <div className="flex flex-col items-start justify-between gap-4">
                <div className="flex items-center justify-start gap-3">
                    <Image
                        src={comment.userPhoto}
                        alt={comment.userName}
                        width={35}
                        height={35}
                        className="rounded-full w-9 h-9"
                    />
                    <p className="font-semibold">{comment.userName}</p>
                </div>

                <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                />

                {comment.fileURL && (
                    <Image
                        src={comment.fileURL}
                        alt="Comment Image"
                        width={100}
                        height={100}
                    />
                )}
            </div>

            {/* Comment bottom part */}
            <div className="flex items-center justify-start gap-2">
                <MdOutlineEmojiEmotions className="w-5 h-5 cursor-pointer text-gray-500" />

                <div className="border border-r border-gray-400 h-3" />

                <button className="text-sm" onClick={onReply}>
                    Reply
                </button>

                <div className="border border-r border-gray-400 h-3" />

                <p className="text-sm">{formatDate(comment.createdAt)}</p>
            </div>

            {/* Render replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-3">
                    {comment.replies.map((reply) => (
                        <CommentCard
                            key={reply.id}
                            comment={reply}
                            onReply={() => {}}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentCard;
