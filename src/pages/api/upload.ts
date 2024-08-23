import type { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { handleError } from "../../utils/errorHandler";

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        try {
            const file = req.body.file;
            const buffer = Buffer.from(file, "base64");

            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Key: `${uuidv4()}-${req.body.filename}`,
                Body: buffer,
                ContentEncoding: "base64",
                ContentType: req.body.filetype,
            };

            const data = await s3.upload(uploadParams).promise();
            res.status(200).json({ url: data.Location });
        } catch (error) {
            handleError(error, res);
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
