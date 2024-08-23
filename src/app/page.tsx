import CommentSection from "@/components/CommentSection";
import LoginButton from "@/components/LoginButton";
import NavBar from "@/components/NavBar";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

export default function Home() {
    return (
        <AuthProvider>
            <NavBar />
            <Toaster />
            <div className="w-full p-10">
                <CommentSection />
            </div>
        </AuthProvider>
    );
}
