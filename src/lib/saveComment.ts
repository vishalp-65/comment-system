import { db } from "./firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const saveComment = async (content: string) => {
    try {
        await addDoc(collection(db, "comments"), {
            content,
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error saving comment: ", error);
    }
};
