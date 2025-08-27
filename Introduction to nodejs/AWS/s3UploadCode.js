import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { createReadStream } from "fs";

const s3Client = new S3Client({
  profile: "nodejs",
});

const fileReadStream = createReadStream(
  "C:\\Users\\anura\\OneDrive\\Documents\\Premiere Pro\\to be edited\\nodejs-course\\section-18\\15_what-is-signed-url-in-s3.mp4"
);

const upload = new Upload({
  client: s3Client,
  params: {
    Bucket: "procodrr-nodejs-bucket",
    Key: "videos/what-is-signed-url-in-s3.mp4",
    Body: fileReadStream,
    ContentType: "video/mp4",
  },
});

upload.on("httpUploadProgress", (progress) => {
  process.stdout.write(
    `\r${((progress.loaded / progress.total) * 100).toFixed(2)}% Uploaded`
  );
});

const response = await upload.done();

console.log(response);
