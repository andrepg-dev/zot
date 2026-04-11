import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class S3Service {
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
}
