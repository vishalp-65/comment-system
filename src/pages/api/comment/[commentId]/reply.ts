import { db } from "@/lib/firebaseConfig"; // Adjust this import based on your project structure
import { arrayUnion, updateDoc, doc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { commentId } = req.query;

    if (req.method === "POST") {
        const { content, userId, userName, userPhoto } = req.body;

        console.log({ content, userId, userName, userPhoto });

        try {
            const commentRef = doc(db, "comments", commentId as string);

            // Create a reply object
            const reply = {
                content,
                userId,
                userName,
                userPhoto,
                createdAt: new Date(), // Use the current date/time
            };

            // Update the document with the new reply using arrayUnion
            await updateDoc(commentRef, {
                replies: arrayUnion(reply),
            });

            res.status(200).json({ message: "Reply added successfully" });
        } catch (error) {
            console.error("Failed to add reply:", error);
            res.status(500).json({ error: "Failed to add reply" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
