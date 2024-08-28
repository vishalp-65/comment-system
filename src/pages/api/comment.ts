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
                orderBy(sortBy as string, "desc")
            );

            const querySnapshot = await getDocs(commentsQuery);
            const comments = [];

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

                comments.push({
                    id: commentDoc.id,
                    ...commentData,
                    reactions,
                    replies, // Include the fetched replies in the response
                });
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
