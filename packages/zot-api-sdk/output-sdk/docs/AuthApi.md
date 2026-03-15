# AuthApi

All URIs are relative to *http://localhost:3010*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**authRegister**](AuthApi.md#authregister) | **POST** /v1/auth/register | User registration |
| [**getProfile**](AuthApi.md#getprofile) | **GET** /v1/auth/profile | Get current user profile |
| [**github**](AuthApi.md#github) | **GET** /v1/auth/github | GitHub OAuth login |
| [**githubAuthRedirect**](AuthApi.md#githubauthredirect) | **GET** /v1/auth/github/callback | GitHub OAuth callback |
| [**google**](AuthApi.md#google) | **GET** /v1/auth/google | Google OAuth login |
| [**googleAuthRedirect**](AuthApi.md#googleauthredirect) | **GET** /v1/auth/google/callback | Google OAuth callback |
| [**login**](AuthApi.md#login) | **POST** /v1/auth/login | User login |
| [**logout**](AuthApi.md#logout) | **GET** /v1/auth/logout | User logout |
| [**profile**](AuthApi.md#profile) | **GET** /v1/auth/refresh-token |  |



## authRegister

> AccessTokenResponseDto authRegister(createUserDto)

User registration

Create a new user account. Returns JWT access token upon successful registration.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '@repo/zot-api-sdk';
import type { AuthRegisterRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new AuthApi();

  const body = {
    // CreateUserDto
    createUserDto: ...,
  } satisfies AuthRegisterRequest;

  try {
    const data = await api.authRegister(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createUserDto** | [CreateUserDto](CreateUserDto.md) |  | |

### Return type

[**AccessTokenResponseDto**](AccessTokenResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User successfully registered |  -  |
| **400** | User already exists or validation failed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getProfile

> UserProfileResponseDto getProfile()

Get current user profile

Returns the authenticated user profile information.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '@repo/zot-api-sdk';
import type { GetProfileRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthApi(config);

  try {
    const data = await api.getProfile();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**UserProfileResponseDto**](UserProfileResponseDto.md)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User profile retrieved successfully |  -  |
| **401** | Not authenticated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## github

> github()

GitHub OAuth login

Initiates GitHub OAuth2 authentication flow. Redirects to GitHub login page.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '@repo/zot-api-sdk';
import type { GithubRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new AuthApi();

  try {
    const data = await api.github();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## githubAuthRedirect

> githubAuthRedirect()

GitHub OAuth callback

Handles GitHub OAuth2 callback. Sets cookie and redirects to frontend.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '@repo/zot-api-sdk';
import type { GithubAuthRedirectRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new AuthApi();

  try {
    const data = await api.githubAuthRedirect();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **500** | User not found after OAuth |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## google

> google()

Google OAuth login

Initiates Google OAuth2 authentication flow. Redirects to Google login page.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '@repo/zot-api-sdk';
import type { GoogleRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new AuthApi();

  try {
    const data = await api.google();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## googleAuthRedirect

> googleAuthRedirect()

Google OAuth callback

Handles Google OAuth2 callback. Sets cookie and redirects to frontend.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '@repo/zot-api-sdk';
import type { GoogleAuthRedirectRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new AuthApi();

  try {
    const data = await api.googleAuthRedirect();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **500** | User not found after OAuth |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## login

> AccessTokenResponseDto login(loginDto)

User login

Authenticate user with email and password. Returns JWT access token.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '@repo/zot-api-sdk';
import type { LoginRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new AuthApi();

  const body = {
    // LoginDto
    loginDto: ...,
  } satisfies LoginRequest;

  try {
    const data = await api.login(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **loginDto** | [LoginDto](LoginDto.md) |  | |

### Return type

[**AccessTokenResponseDto**](AccessTokenResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successfully authenticated |  -  |
| **401** | Invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## logout

> LogoutResponseDto logout()

User logout

Clears authentication cookies and logs out the user.

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '@repo/zot-api-sdk';
import type { LogoutRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthApi(config);

  try {
    const data = await api.logout();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**LogoutResponseDto**](LogoutResponseDto.md)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successfully logged out |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## profile

> profile()



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '@repo/zot-api-sdk';
import type { ProfileRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new AuthApi();

  try {
    const data = await api.profile();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

