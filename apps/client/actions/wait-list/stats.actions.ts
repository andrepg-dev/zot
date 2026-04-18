"use server";

import { FetchWrapper } from "@/lib/api/fetch-wrapper";

export interface WaitListStats {
  _id: string;
  name: string;
  sendEmailToNewSignup: boolean;
  emailTemplateToNewSignUps?: string;
  isSecurityActive: boolean;
  isAvailable: boolean;
  webhook: {
    url: string;
    range: number;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
  dailyRegistration: Array<{
    registrations: number;
    createdAt: string;
  }>;
  topReferrers: Array<{
    referrals: number;
    email: string;
  }>;
  dailyUsersBlocked: Array<{
    blocked: number;
    createdAt: string;
  }>;
  users: {
    total: number;
    referred: number;
    organic: number;
    signUpsToday: number;
  };
  emailsSent: number;
  usersBlocked: number;
  conversionRateOverTime: Array<{
    createdAt: string;
    conversionRate: number;
  }>;
}

export async function getWaitListStats(waitlistId: string) {
  return await FetchWrapper<WaitListStats>(`/wait-list/${waitlistId}/stats`);
}
