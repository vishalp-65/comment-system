"use client";
import CommentSection from "@/components/CommentSection";
import LoadingUI from "@/components/loading/LoadingUI";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
    const { isLoading } = useAuth();

    if (isLoading) {
        console.log("Hit");
        return <LoadingUI />;
    }

    return (
        <>
            <NavBar />
            <div className="w-full p-10">
                <CommentSection />
            </div>
        </>
    );
}
