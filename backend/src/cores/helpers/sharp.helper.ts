import { Injectable } from "@nestjs/common";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { S3Helper } from "./s3.helper";

export interface ResizeOption {
  path: string;
  width?: number;
  height?: number;
  quality?: number;
}

@Injectable()
export class SharpHelper {
  public async resizeAndUpload(
    file: Express.Multer.File,
    option: ResizeOption,
  ): Promise<{ file_path: string; url: string }> {
    const info = await fileTypeFromBuffer(new Uint8Array(file.buffer));

    if (!info) {
      throw new Error("File type not supported");
    }

    const s3Helper = new S3Helper();

    let fileBuffer = file.buffer;

    // convert HEIC/HEIF first
    if (info.mime.includes("heic") || info.mime.includes("heif")) {
      const convertHeic = require("heic-convert");

      fileBuffer = await convertHeic({
        buffer: file.buffer,
        format: "JPEG",
        quality: 0.8,
      });
    }

    const md5Hash = new Bun.CryptoHasher("md5")
      .update(`${Date.now()}-${Math.random()}`)
      .digest("hex");

    // optimize image
    if (info.mime.includes("image")) {
      fileBuffer = await sharp(fileBuffer)
        .resize({
          width: option.width ?? 800,
          height: option.height ?? 800,
          fit: "inside",
          withoutEnlargement: true,
        })
        .rotate()
        .webp({
          quality: option.quality ?? 70,
          effort: 4,
        })
        .toBuffer();
    }

    // upload optimized image
    const uploaded = await s3Helper.uploadFile(
      fileBuffer,
      option.path,
      "public-read",
      md5Hash,
    );

    const fileUrl = new URL(uploaded.Location);

    return {
      file_path: fileUrl.pathname.substring(1),
      url: fileUrl.href,
    };
  }

  public async delete(originalFile: string) {
    const s3Helper = new S3Helper();

    await s3Helper.deleteFile(originalFile);

    return true;
  }
}
