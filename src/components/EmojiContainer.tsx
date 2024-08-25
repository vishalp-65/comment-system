import { reactionEmoji } from "@/utils/emojiData";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import React, { useState } from "react";
import { GoPlus } from "react-icons/go";

interface EmojiContainerProps {
    onReact: (emoji: string) => void;
}

const EmojiContainer = ({ onReact }: EmojiContainerProps) => {
    const [isCustomEmoji, setCustomEmoji] = useState(false);

    return (
        <div
            className="relative transition backdrop-blur-sm bg-gray-100/80 shadow-sm border rounded-full 
        flex items-center justify-center px-3"
        >
            <div className="flex items-center justify-start gap-3 text-xl h-12">
                {reactionEmoji.map((reaction, ind) => (
                    <p
                        key={ind}
                        onClick={() => onReact(reaction.reaction)}
                        className="cursor-pointer hover:scale-150 transition"
                    >
                        {reaction.reaction}
                    </p>
                ))}
                <div
                    onClick={() => setCustomEmoji(!isCustomEmoji)}
                    className="cursor-pointer"
                >
                    <div className="bg-slate-200 rounded-full p-1.5 text-gray-700">
                        <GoPlus />
                    </div>
                </div>
            </div>
            {isCustomEmoji && (
                <div className="absolute bottom-[101%] left-0 md:left-[101%] md:-bottom-[50%]">
                    <EmojiPicker
                        onEmojiClick={(
                            emojiData: EmojiClickData,
                            event: MouseEvent
                        ) => onReact(emojiData.emoji)}
                    />
                </div>
            )}
        </div>
    );
};

export default EmojiContainer;
