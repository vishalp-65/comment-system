import { db } from "@/lib/firebaseConfig";
import { arrayUnion, updateDoc, doc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { commentId, isReply } = req.query;

    if (req.method === "POST") {
        const { userId, emoji } = req.body;

        try {
            // Determine the correct collection based on whether it's a comment or a reply
            const collectionName = isReply === "true" ? "replies" : "comments";
            const commentRef = doc(db, collectionName, commentId as string);

            // Update the document with the new reaction
            await updateDoc(commentRef, {
                reactions: arrayUnion({ userId, emoji }),
            });

            res.status(200).json({ message: "Reaction added successfully" });
        } catch (error) {
            console.error("Failed to add reaction:", error);
            res.status(500).json({ error: "Failed to add reaction" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
