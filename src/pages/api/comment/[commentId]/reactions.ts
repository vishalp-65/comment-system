import { db } from "@/lib/firebaseConfig";
import {
    updateDoc,
    doc,
    arrayRemove,
    arrayUnion,
    getDoc,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { commentId, isReply } = req.query;

    if (req.method === "POST") {
        const { userId, emoji } = req.body;

        try {
            if (!userId || !emoji || !commentId) {
                return res.status(400).json({ error: "Fields are missing" });
            }

            const collectionName = isReply === "true" ? "replies" : "comments";
            const commentRef = doc(db, collectionName, commentId as string);

            // Use getDoc to fetch the current comment data
            const commentSnap = await getDoc(commentRef);
            const commentData = commentSnap.data();

            if (!commentData) {
                return res.status(404).json({ error: "Comment not found" });
            }

            const reactions = commentData.reactions || [];

            // Find existing reaction by user
            const existingReaction = reactions.find(
                (reaction: any) => reaction.userId === userId
            );

            if (existingReaction) {
                // Remove the existing reaction
                await updateDoc(commentRef, {
                    reactions: arrayRemove(existingReaction),
                });
            }

            if (!existingReaction || existingReaction.emoji !== emoji) {
                // Add the new reaction only if it's different from the existing one
                await updateDoc(commentRef, {
                    reactions: arrayUnion({ userId, emoji, count: 1 }),
                });
            }

            res.status(200).json({ message: "Reaction updated successfully" });
        } catch (error) {
            console.error("Failed to update reaction:", error);
            res.status(500).json({ error: "Failed to update reaction" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
