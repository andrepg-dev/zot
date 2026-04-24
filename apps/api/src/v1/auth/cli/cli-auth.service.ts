import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { randomBytes } from "crypto";
import { Model, Types } from "mongoose";

import { ApiKeyService } from "../../api-key/api-key.service";
import {
  CliDeviceSession,
  type CliDeviceSessionStatus,
} from "./schemas/cli-device-session.schema";

const DEVICE_CODE_BYTES = 32;
const SESSION_TOKEN_BYTES = 32;
const USER_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const EXPIRES_IN_SECONDS = 10 * 60;
const POLL_INTERVAL_SECONDS = 2;
const MIN_POLL_INTERVAL_MS = POLL_INTERVAL_SECONDS * 1000 - 200;

export type ApprovalLookup = { sessionToken?: string; userCode?: string };

@Injectable()
export class CliAuthService {
  constructor(
    @InjectModel(CliDeviceSession.name)
    private readonly sessionModel: Model<CliDeviceSession>,
    private readonly apiKeyService: ApiKeyService,
    private readonly configService: ConfigService,
  ) {}

  async start(clientName: string | undefined) {
    const deviceCode = randomBytes(DEVICE_CODE_BYTES).toString("hex");
    const sessionToken = randomBytes(SESSION_TOKEN_BYTES).toString("hex");
    const userCode = this.generateUserCode();

    const expiresAt = new Date(Date.now() + EXPIRES_IN_SECONDS * 1000);

    await this.sessionModel.create({
      deviceCode,
      sessionToken,
      userCode,
      status: "pending",
      clientName,
      expiresAt,
      interval: POLL_INTERVAL_SECONDS,
    });

    const frontendUrl = this.configService.get<string>("FRONTEND_URL") ?? "http://localhost:3000";
    const base = frontendUrl.replace(/\/$/, "");

    return {
      deviceCode,
      userCode,
      verificationUri: `${base}/app/cli/device`,
      verificationUriComplete: `${base}/app/cli/authorize?session=${sessionToken}`,
      expiresIn: EXPIRES_IN_SECONDS,
      interval: POLL_INTERVAL_SECONDS,
    };
  }

  async getApprovalView(lookup: ApprovalLookup) {
    const session = await this.findActive(lookup);
    return {
      status: session.status,
      clientName: session.clientName,
      userCode: session.userCode,
      expiresAt: session.expiresAt,
    };
  }

  async approve(lookup: ApprovalLookup, userId: Types.ObjectId, apiKeyName: string) {
    const session = await this.findActive(lookup);
    if (session.status !== "pending") {
      throw new ConflictException(`Session is already ${session.status}`);
    }

    const apiKey = await this.apiKeyService.create({ name: apiKeyName }, userId);
    if (!apiKey) {
      throw new ConflictException("Could not issue API key.");
    }

    session.status = "approved";
    session.approvedBy = userId;
    session.apiKeyId = apiKey._id as Types.ObjectId;
    session.apiKeyPlaintext = apiKey.apiKey;
    await session.save();

    return {
      status: "approved" as const,
      clientName: session.clientName,
      apiKeyName: apiKey.name,
    };
  }

  async deny(lookup: ApprovalLookup, userId: Types.ObjectId) {
    const session = await this.findActive(lookup);
    if (session.status === "approved") {
      throw new ConflictException("Session already approved; cannot deny.");
    }
    if (session.status === "denied") {
      return { status: "denied" as const };
    }
    session.status = "denied";
    session.approvedBy = userId;
    await session.save();
    return { status: "denied" as const };
  }

  async poll(deviceCode: string) {
    const session = await this.sessionModel
      .findOne({ deviceCode })
      .select("+apiKeyPlaintext");

    if (!session) {
      return { status: "expired_token" as const };
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      return { status: "expired_token" as const };
    }

    const now = new Date();
    if (
      session.lastPolledAt &&
      now.getTime() - session.lastPolledAt.getTime() < MIN_POLL_INTERVAL_MS
    ) {
      session.lastPolledAt = now;
      await session.save();
      return { status: "slow_down" as const, interval: session.interval };
    }
    session.lastPolledAt = now;

    if (session.status === "denied") {
      await session.save();
      return { status: "access_denied" as const };
    }

    if (session.status === "pending") {
      await session.save();
      return { status: "authorization_pending" as const, interval: session.interval };
    }

    if (session.status === "approved") {
      const apiKey = session.apiKeyPlaintext;
      if (!apiKey) {
        await session.save();
        return { status: "expired_token" as const };
      }
      session.apiKeyPlaintext = undefined;
      session.status = "expired";
      session.expiresAt = new Date();
      await session.save();
      return { status: "approved" as const, apiKey };
    }

    await session.save();
    return { status: "expired_token" as const };
  }

  private async findActive(lookup: ApprovalLookup) {
    const query: Record<string, unknown> = {};
    if (lookup.sessionToken) query.sessionToken = lookup.sessionToken;
    else if (lookup.userCode) query.userCode = lookup.userCode;
    else throw new NotFoundException("sessionToken or userCode required.");

    const session = await this.sessionModel.findOne(query);
    if (!session) throw new NotFoundException("CLI session not found.");
    if (session.expiresAt.getTime() <= Date.now()) {
      throw new NotFoundException("CLI session has expired.");
    }
    return session;
  }

  private generateUserCode(): string {
    const pick = (n: number) => {
      const bytes = randomBytes(n);
      let out = "";
      for (let i = 0; i < n; i++) {
        out += USER_CODE_ALPHABET[bytes[i] % USER_CODE_ALPHABET.length];
      }
      return out;
    };
    return `${pick(4)}-${pick(4)}`;
  }
}

export type PollResult = Awaited<ReturnType<CliAuthService["poll"]>>;
export type ApprovalStatus = CliDeviceSessionStatus;
