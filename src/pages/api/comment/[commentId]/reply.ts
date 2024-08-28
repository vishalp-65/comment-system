import { db } from "@/lib/firebaseConfig";
import {
    arrayUnion,
    updateDoc,
    doc,
    addDoc,
    collection,
    Timestamp,
} from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { commentId } = req.query;

    if (req.method === "POST") {
        const { content, userId, userName, userPhoto, fileURL } = req.body;

        try {
            // Create a new reply in the "replies" collection with a unique ID
            const replyDocRef = await addDoc(collection(db, "replies"), {
                content,
                userId,
                fileURL: fileURL || "",
                userName,
                userPhoto,
                commentId,
                createdAt: Timestamp.fromDate(new Date()),
                reactions: [],
                replies: [], // Initialize empty replies array for nested replies
            });

            // Get the ID of the newly created reply
            const replyId = replyDocRef.id;

            // Update the "comments" collection by adding the replyId to the replies array
            const commentRef = doc(db, "comments", commentId as string);
            await updateDoc(commentRef, {
                replies: arrayUnion(replyId), // Add only the replyId
            });

            res.status(200).json({
                message: "Reply added successfully",
                replyId,
            });
        } catch (error) {
            console.error("Failed to add reply:", error);
            res.status(500).json({ error: "Failed to add reply" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
