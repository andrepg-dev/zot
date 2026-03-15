# @repo/zot-api-sdk@1.0.0

A TypeScript SDK client for the localhost API.

## Usage

First, install the SDK from npm.

```bash
npm install @repo/zot-api-sdk --save
```

Next, try it out.


```ts
import {
  Configuration,
  APIKeysApi,
} from '@repo/zot-api-sdk';
import type { APIKeysCreateRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new APIKeysApi(config);

  const body = {
    // CreateApiKeyDto
    createApiKeyDto: ...,
  } satisfies APIKeysCreateRequest;

  try {
    const data = await api.aPIKeysCreate(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```


## Documentation

### API Endpoints

All URIs are relative to *http://localhost:3010*

| Class | Method | HTTP request | Description
| ----- | ------ | ------------ | -------------
*APIKeysApi* | [**aPIKeysCreate**](docs/APIKeysApi.md#apikeyscreate) | **POST** /v1/api-key | Create a new API key
*APIKeysApi* | [**aPIKeysFindAll**](docs/APIKeysApi.md#apikeysfindall) | **GET** /v1/api-key | Get all API keys
*APIKeysApi* | [**aPIKeysFindOne**](docs/APIKeysApi.md#apikeysfindone) | **GET** /v1/api-key/{id} | Get a specific API key
*APIKeysApi* | [**aPIKeysRemove**](docs/APIKeysApi.md#apikeysremove) | **DELETE** /v1/api-key/{id} | Delete an API key
*APIKeysApi* | [**aPIKeysUpdate**](docs/APIKeysApi.md#apikeysupdate) | **PATCH** /v1/api-key/{id} | Update an API key
*AuthApi* | [**authRegister**](docs/AuthApi.md#authregister) | **POST** /v1/auth/register | User registration
*AuthApi* | [**getProfile**](docs/AuthApi.md#getprofile) | **GET** /v1/auth/profile | Get current user profile
*AuthApi* | [**github**](docs/AuthApi.md#github) | **GET** /v1/auth/github | GitHub OAuth login
*AuthApi* | [**githubAuthRedirect**](docs/AuthApi.md#githubauthredirect) | **GET** /v1/auth/github/callback | GitHub OAuth callback
*AuthApi* | [**google**](docs/AuthApi.md#google) | **GET** /v1/auth/google | Google OAuth login
*AuthApi* | [**googleAuthRedirect**](docs/AuthApi.md#googleauthredirect) | **GET** /v1/auth/google/callback | Google OAuth callback
*AuthApi* | [**login**](docs/AuthApi.md#login) | **POST** /v1/auth/login | User login
*AuthApi* | [**logout**](docs/AuthApi.md#logout) | **GET** /v1/auth/logout | User logout
*AuthApi* | [**profile**](docs/AuthApi.md#profile) | **GET** /v1/auth/refresh-token | 
*EmailTemplatesApi* | [**emailTemplatesCreate**](docs/EmailTemplatesApi.md#emailtemplatescreate) | **POST** /v1/email-templates | 
*EmailTemplatesApi* | [**emailTemplatesFindAll**](docs/EmailTemplatesApi.md#emailtemplatesfindall) | **GET** /v1/email-templates | 
*EmailTemplatesApi* | [**emailTemplatesFindOne**](docs/EmailTemplatesApi.md#emailtemplatesfindone) | **GET** /v1/email-templates/{id} | 
*EmailTemplatesApi* | [**emailTemplatesRemove**](docs/EmailTemplatesApi.md#emailtemplatesremove) | **DELETE** /v1/email-templates/{id} | 
*EmailTemplatesApi* | [**emailTemplatesUpdate**](docs/EmailTemplatesApi.md#emailtemplatesupdate) | **PATCH** /v1/email-templates/{id} | 
*EmailsApi* | [**sendEmail**](docs/EmailsApi.md#sendemail) | **POST** /v1/emails | 
*HealthApi* | [**main**](docs/HealthApi.md#main) | **GET** /v1 | Health check
*ReactToHTMLApi* | [**compile**](docs/ReactToHTMLApi.md#compile) | **POST** /v1/react2html | Compile React to HTML
*SubscriptionsApi* | [**createCheckoutSession**](docs/SubscriptionsApi.md#createcheckoutsession) | **POST** /v1/subscriptions/checkout-session | Create Stripe checkout session for Zot Premium
*SubscriptionsApi* | [**stripeWebhook**](docs/SubscriptionsApi.md#stripewebhook) | **POST** /v1/subscriptions/webhook | Stripe webhook receiver
*UserQuoteApi* | [**findUserQuote**](docs/UserQuoteApi.md#finduserquote) | **GET** /v1/user-quote | 
*UserQuoteApi* | [**getUsageHistory**](docs/UserQuoteApi.md#getusagehistory) | **GET** /v1/user-quote/history | 
*WaitListApi* | [**waitListCreate**](docs/WaitListApi.md#waitlistcreate) | **POST** /v1/wait-list | Create a new waitlist
*WaitListApi* | [**waitListFindAll**](docs/WaitListApi.md#waitlistfindall) | **GET** /v1/wait-list | Get all waitlists
*WaitListApi* | [**waitListFindOne**](docs/WaitListApi.md#waitlistfindone) | **GET** /v1/wait-list/{id} | Get a specific waitlist
*WaitListApi* | [**waitListRemove**](docs/WaitListApi.md#waitlistremove) | **DELETE** /v1/wait-list/{id} | Delete a waitlist
*WaitListApi* | [**waitListUpdate**](docs/WaitListApi.md#waitlistupdate) | **PATCH** /v1/wait-list/{id} | Update a waitlist
*WaitListApi* | [**waitlistStats**](docs/WaitListApi.md#waitliststats) | **GET** /v1/wait-list/{waitlistId}/stats | Get waitlist statistics
*WaitListUsersApi* | [**count**](docs/WaitListUsersApi.md#count) | **GET** /v1/wait-list/{waitlistId}/user/count | Get waitlist user counts
*WaitListUsersApi* | [**findByEmail**](docs/WaitListUsersApi.md#findbyemail) | **GET** /v1/wait-list/{waitlistId}/user/search | Search user by email
*WaitListUsersApi* | [**waitListUsersFindAll**](docs/WaitListUsersApi.md#waitlistusersfindall) | **GET** /v1/wait-list/{waitlistId}/user | Get all waitlist users
*WaitListUsersApi* | [**waitListUsersRegister**](docs/WaitListUsersApi.md#waitlistusersregister) | **POST** /v1/wait-list/{waitlistId}/user | Register for a waitlist
*WaitListUsersApi* | [**waitListUsersRemove**](docs/WaitListUsersApi.md#waitlistusersremove) | **DELETE** /v1/wait-list/{waitlistId}/user/{email} | Remove user from waitlist


### Models

- [AccessTokenResponseDto](docs/AccessTokenResponseDto.md)
- [CheckoutSessionResponseDto](docs/CheckoutSessionResponseDto.md)
- [CreateApiKeyDto](docs/CreateApiKeyDto.md)
- [CreateCheckoutSessionDto](docs/CreateCheckoutSessionDto.md)
- [CreateUserDto](docs/CreateUserDto.md)
- [CreateWaitListDto](docs/CreateWaitListDto.md)
- [LoginDto](docs/LoginDto.md)
- [LogoutResponseDto](docs/LogoutResponseDto.md)
- [ReactToHtmlDto](docs/ReactToHtmlDto.md)
- [ReactToHtmlResponseDto](docs/ReactToHtmlResponseDto.md)
- [RegisterWaitListUserDto](docs/RegisterWaitListUserDto.md)
- [UpdateApiKeyDto](docs/UpdateApiKeyDto.md)
- [UpdateWaitListDto](docs/UpdateWaitListDto.md)
- [UserProfileResponseDto](docs/UserProfileResponseDto.md)
- [WaitListResponseDto](docs/WaitListResponseDto.md)
- [WaitListUserCountResponseDto](docs/WaitListUserCountResponseDto.md)
- [WaitListUserResponseDto](docs/WaitListUserResponseDto.md)
- [WebhookAcceptedResponseDto](docs/WebhookAcceptedResponseDto.md)
- [WebhookConfigDto](docs/WebhookConfigDto.md)

### Authorization


Authentication schemes defined for the API:
<a id="JWT-auth"></a>
#### JWT-auth


- **Type**: HTTP Bearer Token authentication (JWT)

## About

This TypeScript SDK client supports the [Fetch API](https://fetch.spec.whatwg.org/)
and is automatically generated by the
[OpenAPI Generator](https://openapi-generator.tech) project:

- API version: `1.0.0`
- Package version: `1.0.0`
- Generator version: `7.20.0`
- Build package: `org.openapitools.codegen.languages.TypeScriptFetchClientCodegen`

The generated npm module supports the following:

- Environments
  * Node.js
  * Webpack
  * Browserify
- Language levels
  * ES5 - you must have a Promises/A+ library installed
  * ES6
- Module systems
  * CommonJS
  * ES6 module system

For more information, please visit [https://zot.so](https://zot.so)

## Development

### Building

To build the TypeScript source code, you need to have Node.js and npm installed.
After cloning the repository, navigate to the project directory and run:

```bash
npm install
npm run build
```

### Publishing

Once you've built the package, you can publish it to npm:

```bash
npm publish
```

## License

[]()
