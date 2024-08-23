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
                <div
                    className="flex items-center justify-between gap-1 cursor-pointer border border-gray-200 shadow-md rounded-md
                    px-2 py-1.5"
                    onClick={login}
                >
                    <FcGoogle className="h-6 w-6" />
                    <button>Sigin with Google</button>
                </div>
            )}
        </div>
    );
};

export default LoginButton;
