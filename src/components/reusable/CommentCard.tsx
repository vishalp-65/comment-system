import { formatDate } from "@/utils/helper";
import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiContainer from "../EmojiContainer";
import { CommentCardProps } from "@/types/comment";

const CommentCard = ({ comment, onReply, onReact }: CommentCardProps) => {
    const [isEmoji, setEmoji] = useState(false);
    let hideTimeout: NodeJS.Timeout;

    const showEmojiContainer = () => {
        clearTimeout(hideTimeout);
        setEmoji(true);
    };

    const hideEmojiContainer = () => {
        hideTimeout = setTimeout(() => {
            setEmoji(false);
        }, 500);
    };

    return (
        <div className="p-2 flex flex-col gap-3">
            <div className="flex flex-col items-start justify-between gap-3">
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
                        className="rounded-md w-auto h-auto ml-1"
                    />
                )}
            </div>

            {/* Comment bottom part */}
            <div className="relative flex items-center justify-start gap-2">
                <div
                    className="relative"
                    onMouseEnter={showEmojiContainer}
                    onMouseLeave={hideEmojiContainer}
                >
                    <MdOutlineEmojiEmotions className="w-5 h-5 cursor-pointer text-gray-500" />
                    {isEmoji && (
                        <div className="absolute -top-14 -left-5">
                            <EmojiContainer
                                onReact={(emoji) =>
                                    onReact(emoji, comment.id, false)
                                } // Pass false for comment
                            />
                        </div>
                    )}
                </div>

                {comment?.reactions?.map((reaction) => (
                    <div
                        key={reaction.emoji}
                        className="flex items-center gap-1 cursor-pointer"
                    >
                        <div
                            className="bg-gray-200 px-1 rounded-full space-x-1"
                            onClick={() =>
                                onReact(reaction.emoji, comment.id, false)
                            }
                        >
                            <span>{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                        </div>
                    </div>
                ))}

                <div className="border border-r border-gray-400 h-3" />

                <button className="text-sm" onClick={() => onReply(comment.id)}>
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
                            onReply={onReply}
                            onReact={(emoji) => onReact(emoji, reply.id, true)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentCard;
