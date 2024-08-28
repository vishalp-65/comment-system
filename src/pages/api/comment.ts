import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebaseConfig";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    orderBy,
    addDoc,
    Timestamp,
} from "firebase/firestore";
import { handleError } from "@/utils/errorHandler";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    if (method === "GET") {
        try {
            const { sortBy = "createdAt", pageSize = 8 } = req.query;

            // Fetch comments
            const commentsQuery = query(
                collection(db, "comments"),
                orderBy("createdAt", "desc") // Default ordering by createdAt
            );

            const querySnapshot = await getDocs(commentsQuery);
            let comments = [];

            for (const commentDoc of querySnapshot.docs) {
                const commentData = commentDoc.data();

                // Fetch replies for each comment
                const replies = [];
                if (commentData.replies && commentData.replies.length > 0) {
                    for (const replyId of commentData.replies) {
                        const replyDocRef = doc(db, "replies", replyId);
                        const replyDoc = await getDoc(replyDocRef);
                        if (replyDoc.exists()) {
                            replies.push({
                                id: replyDoc.id,
                                ...replyDoc.data(),
                            });
                        }
                    }
                }

                // Attach reactions with their counts
                const reactions = commentData.reactions || [];

                // Calculate total reactions count
                const totalReactions = reactions.length;

                comments.push({
                    id: commentDoc.id,
                    ...commentData,
                    reactions,
                    replies, // Include the fetched replies in the response
                    totalReactions, // Include total reactions count
                });
            }

            // Sort comments by popularity if requested
            if (sortBy === "popular") {
                comments.sort((a, b) => b.totalReactions - a.totalReactions);
            }

            res.status(200).json({ comments });
        } catch (error) {
            handleError(error, res);
        }
    } else if (method === "POST") {
        try {
            const { content, fileURL, userId, userName, userPhoto } = req.body;

            if (!content || !userId) {
                return res
                    .status(400)
                    .json({ error: "Missing required fields" });
            }

            await addDoc(collection(db, "comments"), {
                content,
                fileURL: fileURL || "",
                userName,
                userPhoto,
                userId,
                createdAt: Timestamp.fromDate(new Date()),
                replies: [],
                reactions: [],
            });

            res.status(201).json({ message: "Comment added successfully" });
        } catch (error) {
            handleError(error, res);
        }
    } else {
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
