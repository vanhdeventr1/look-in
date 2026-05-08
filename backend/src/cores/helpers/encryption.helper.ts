import * as crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

export class EncryptionHelper {
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(SECRET_KEY),
      iv,
    );
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  static decrypt(text: string): string {
    try {
      const [ivHex, encryptedHex] = text.split(":");
      const iv = Buffer.from(ivHex, "hex");
      const encrypted = Buffer.from(encryptedHex, "hex");
      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(SECRET_KEY),
        iv,
      );
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);
      return decrypted.toString();
    } catch {
      return text;
    }
  }
}
