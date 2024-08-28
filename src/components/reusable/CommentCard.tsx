import { formatDate } from "@/utils/helper";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiContainer from "../EmojiContainer";
import { CommentCardProps } from "@/types/comment";
import sanitizeHtml from "sanitize-html";

const CommentCard = ({ comment, onReply, onReact }: CommentCardProps) => {
    const [isEmoji, setEmoji] = useState(false);
    const [content, setContent] = useState("");
    const [isExpanded, setExpanded] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
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

    const handleShowMore = () => {
        setExpanded(true);
    };

    const handleShowLess = () => {
        setExpanded(false);
    };

    const highlightTags = (content: string) => {
        return content.replace(
            /@(\w+)/g,
            '<span class="bg-blue-300 p-1 rounded-md"><span class="text-blue-800">@$1</span></div>'
        );
    };

    useEffect(() => {
        const checkIfContentExceeds = () => {
            const contentElement = contentRef.current;
            if (contentElement) {
                const lineHeight = parseInt(
                    window.getComputedStyle(contentElement).lineHeight
                );
                const maxHeight = lineHeight * 3;

                if (contentElement.offsetHeight > maxHeight) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        };

        checkIfContentExceeds();
    }, [comment.content]);

    return (
        <div className="p-2 w-full flex flex-col gap-3">
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

                <div className="text-gray-700">
                    <div
                        ref={contentRef}
                        className={`content text-editor-content text-wrap w-[20rem] md:w-fit ${
                            isExpanded ? "" : "max-h-[7em] overflow-hidden"
                        }`}
                        style={{ whiteSpace: "pre-wrap" }}
                        dangerouslySetInnerHTML={{
                            __html: highlightTags(comment.content),
                        }}
                    />
                    {showMore && !isExpanded && (
                        <button
                            onClick={handleShowMore}
                            className="text-black text-sm font-semibold mt-1"
                        >
                            Show More
                        </button>
                    )}
                    {isExpanded && (
                        <button
                            onClick={handleShowLess}
                            className="text-black text-sm font-semibold mt-1"
                        >
                            Show Less
                        </button>
                    )}
                </div>

                {comment.fileURL && (
                    <div className="relative w-52 h-52 ml-1">
                        <Image
                            src={comment.fileURL}
                            alt="Comment Image"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                        />
                    </div>
                )}
            </div>

            {/* Comment bottom part */}
            <div className="relative flex items-center justify-start gap-4 flex-wrap">
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

                <div className="flex items-center justify-start gap-2 flex-wrap">
                    {comment?.reactions?.map((reaction) => (
                        <div
                            key={reaction.emoji}
                            className="flex items-center gap-1 cursor-pointer"
                        >
                            <div
                                className="bg-gray-100 border flex-nowrap border-gray-300 px-1.5 rounded-full space-x-1 hover:scale-110 transition"
                                onClick={() =>
                                    onReact(reaction.emoji, comment.id, false)
                                }
                            >
                                <span>{reaction.emoji}</span>
                                <span>{reaction.count}</span>
                            </div>
                        </div>
                    ))}
                </div>

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
