export * from './aPIKeysApi';
import { APIKeysApi } from './aPIKeysApi';
export * from './aPIKeysApiInterface'
export * from './aiServerConnectionApi';
import { AiServerConnectionApi } from './aiServerConnectionApi';
export * from './aiServerConnectionApiInterface'
export * from './authApi';
import { AuthApi } from './authApi';
export * from './authApiInterface'
export * from './emailTemplatesApi';
import { EmailTemplatesApi } from './emailTemplatesApi';
export * from './emailTemplatesApiInterface'
export * from './emailsApi';
import { EmailsApi } from './emailsApi';
export * from './emailsApiInterface'
export * from './generalStatsApi';
import { GeneralStatsApi } from './generalStatsApi';
export * from './generalStatsApiInterface'
export * from './healthApi';
import { HealthApi } from './healthApi';
export * from './healthApiInterface'
export * from './reactToHTMLApi';
import { ReactToHTMLApi } from './reactToHTMLApi';
export * from './reactToHTMLApiInterface'
export * from './subscriptionsApi';
import { SubscriptionsApi } from './subscriptionsApi';
export * from './subscriptionsApiInterface'
export * from './userQuoteApi';
import { UserQuoteApi } from './userQuoteApi';
export * from './userQuoteApiInterface'
export * from './usersApi';
import { UsersApi } from './usersApi';
export * from './usersApiInterface'
export * from './waitListApi';
import { WaitListApi } from './waitListApi';
export * from './waitListApiInterface'
export * from './waitListUsersApi';
import { WaitListUsersApi } from './waitListUsersApi';
export * from './waitListUsersApiInterface'
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export { RequestFile } from '../model/models';

export const APIS = [APIKeysApi, AiServerConnectionApi, AuthApi, EmailTemplatesApi, EmailsApi, GeneralStatsApi, HealthApi, ReactToHTMLApi, SubscriptionsApi, UserQuoteApi, UsersApi, WaitListApi, WaitListUsersApi];
