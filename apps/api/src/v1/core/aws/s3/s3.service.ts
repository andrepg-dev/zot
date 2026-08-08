import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";
import { isEmailSafeImageType, toEmailSafeImage } from "@api/src/common/image-transcode";

const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private client: S3Client;
  private bucketName: string | undefined;

  constructor(private readonly configService: ConfigService) {
    const s3_region = this.configService.get<string>("AWS_REGION");
    const accessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get<string>("AWS_SECRET_ACCESS_KEY");
    this.bucketName = this.configService.get<string>("AWS_BUCKET_NAME");

    if (!s3_region) {
      throw new Error("S3_REGION not found in environment variables");
    }

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("S3_ACCESS_KEY or S3_SECRET_ACCESS_KEY not found in environment variables");
    }

    this.client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async uploadSingleFile({ file }: { file: any }) {
    try {
      const key = `${uuidv4()}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",

        Metadata: {
          originalName: file.originalname,
        },
      });

      await this.client.send(command);

      return {
        url: this.getFileUrl(key),
        key,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getFileUrl(key: string) {
    return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
  }

  /**
   * Host an in-memory buffer and return its public URL.
   *
   * Images are normalized to an email-safe format first: AVIF/WEBP render in a
   * desktop browser (so the editor preview looks fine) but come out blank in
   * headless-Chromium screenshots and in most inboxes. JPEG/PNG/GIF pass
   * through untouched.
   */
  async uploadBuffer(buffer: Buffer, contentType: string, folder = "previews"): Promise<string> {
    let body = buffer;
    let type = contentType;
    if (type.startsWith("image/") && !isEmailSafeImageType(type)) {
      try {
        const safe = await toEmailSafeImage(buffer, type);
        body = safe.buffer;
        type = safe.contentType;
      } catch (err) {
        this.logger.warn(`Image transcode failed for ${type}; uploading original bytes.`, err);
      }
    }

    const key = `${folder}/${uuidv4()}.${EXT_BY_TYPE[type] ?? "jpg"}`;
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: body,
          ContentType: type,
          ACL: "public-read",
        }),
      );
      return this.publicUrlForKey(key);
    } catch (err) {
      this.logger.error("S3 upload failed", err);
      throw new InternalServerErrorException("Failed to upload file to S3.");
    }
  }

  /** Public URL for an exact key, path-segment encoded. */
  publicUrlForKey(key: string): string {
    const encodedKey = key
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");
    return `https://${this.bucketName}.s3.amazonaws.com/${encodedKey}`;
  }

  /**
   * Delete an object addressed by its public URL. Returns false when the URL is
   * malformed or points outside our bucket, so a stray URL can never turn into
   * a delete against something else.
   */
  async deletePublicUrl(url: string): Promise<boolean> {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return false;
    }
    const expectedHost = `${this.bucketName}.s3.amazonaws.com`;
    if (parsed.protocol !== "https:" || parsed.hostname !== expectedHost) {
      return false;
    }
    const key = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    if (!key) return false;
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }));
    return true;
  }

  /** Overwrite an object at an exact key, keeping its URL stable. */
  async putObjectAtKey(key: string, buffer: Buffer, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ACL: "public-read",
      }),
    );
  }
}
