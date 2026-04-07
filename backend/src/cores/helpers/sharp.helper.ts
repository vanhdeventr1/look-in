import { Injectable } from "@nestjs/common";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { S3Helper } from "./s3.helper";

export interface DimensionDetail {
  width: number;
  fit: "contain" | "inside";
  prefix: string;
}

export interface ResizeOption {
  path: string;
}

export interface FileDimension {
  dimensions: Array<DimensionDetail>;
}

@Injectable()
export class SharpHelper {
  public async resizeAndUpload(
    file: Express.Multer.File,
    option: ResizeOption,
  ): Promise<{ file_path: string; url: string }> {
    const info = await fileTypeFromBuffer(new Uint8Array(file.buffer));
    if (!info) throw new Error("File type not supported");

    const s3Helper = new S3Helper();
    let fileUrl: URL;

    if (info.mime.includes("image")) {
      const md5Hash = new Bun.CryptoHasher("md5")
        .update(new Date().toISOString())
        .digest("hex");

      let fileBuffer = file.buffer;

      // Convert HEIC/HEIF to PNG first
      if (info.mime.includes("heic") || info.mime.includes("heif")) {
        const convertHeic = require("heic-convert");
        fileBuffer = await convertHeic({
          buffer: file.buffer,
          format: "PNG",
          quality: 1,
        });
      }

      // Upload original only — no resizing
      const originalBuffer = await sharp(fileBuffer).webp().toBuffer();
      const uploaded = await s3Helper.uploadFile(
        originalBuffer,
        option.path,
        "public-read",
        md5Hash,
      );

      fileUrl = new URL(uploaded.Location);
    } else {
      const uploaded = await s3Helper.uploadFile(
        file.buffer,
        option.path,
        "public-read",
      );
      fileUrl = new URL(uploaded.Location);
    }

    return { file_path: fileUrl.pathname.substring(1), url: fileUrl.href };
  }

  public async delete(originalFile: string) {
    const s3Helper = new S3Helper();
    await s3Helper.deleteFile(originalFile);
    return true;
  }
}
