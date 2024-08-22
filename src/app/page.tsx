import LoginButton from "@/components/LoginButton";
import { AuthProvider } from "@/context/AuthContext";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

export default function Home() {
    return (
        <AuthProvider>
            <LoginButton />
            <Toaster />
        </AuthProvider>
    );
}
