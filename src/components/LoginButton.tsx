"use client";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";

const LoginButton = () => {
    const { user, login, logout } = useAuth();

    return (
        <div>
            {user ? (
                <button onClick={logout}>Logout</button>
            ) : (
                <div className="flex items-center justify-between gap-1">
                    <FcGoogle className="h-6 w-6" />
                    <button onClick={login}>Sigin with Google</button>
                </div>
            )}
        </div>
    );
};

export default LoginButton;
