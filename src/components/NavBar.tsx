"use client";
import Image from "next/image";
import LoginButton from "./LoginButton";
import { useAuth } from "@/context/AuthContext";

const NavBar = () => {
    const { user } = useAuth();

    return (
        <div className="flex items-center justify-between px-4 py-1">
            <div className="flex items-center gap-2 justify-start">
                {user && (
                    <Image
                        src={user?.photoURL!}
                        width={30}
                        height={30}
                        alt={user?.displayName!}
                        className="rounded-full w-9 h-9"
                    />
                )}
                <p>{user?.displayName}</p>
            </div>
            <LoginButton />
        </div>
    );
};

export default NavBar;
