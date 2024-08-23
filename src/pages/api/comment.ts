import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/firebaseConfig";
import {
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    startAfter,
    Timestamp,
} from "firebase/firestore";
import { handleError } from "../../utils/errorHandler";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req;

    if (method === "GET") {
        try {
            const {
                sortBy = "createdAt",
                pageSize = 8,
                lastVisible,
            } = req.query;
            const commentsQuery = lastVisible
                ? query(
                      collection(db, "comments"),
                      orderBy(sortBy as string, "desc"),
                      startAfter(lastVisible),
                      limit(Number(pageSize))
                  )
                : query(
                      collection(db, "comments"),
                      orderBy(sortBy as string, "desc"),
                      limit(Number(pageSize))
                  );

            const querySnapshot = await getDocs(commentsQuery);
            const comments = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

            res.status(200).json({ comments, lastVisible: lastDoc?.id });
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
