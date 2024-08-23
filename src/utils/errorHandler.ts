import type { NextApiResponse } from "next";

export const handleError = (error: any, res: NextApiResponse) => {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
};
