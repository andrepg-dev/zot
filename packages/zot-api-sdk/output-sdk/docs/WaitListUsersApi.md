# WaitListUsersApi

All URIs are relative to *http://localhost:3010*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**count**](WaitListUsersApi.md#count) | **GET** /v1/wait-list/{waitlistId}/user/count | Get waitlist user counts |
| [**findByEmail**](WaitListUsersApi.md#findbyemail) | **GET** /v1/wait-list/{waitlistId}/user/search | Search user by email |
| [**waitListUsersFindAll**](WaitListUsersApi.md#waitlistusersfindall) | **GET** /v1/wait-list/{waitlistId}/user | Get all waitlist users |
| [**waitListUsersRegister**](WaitListUsersApi.md#waitlistusersregister) | **POST** /v1/wait-list/{waitlistId}/user | Register for a waitlist |
| [**waitListUsersRemove**](WaitListUsersApi.md#waitlistusersremove) | **DELETE** /v1/wait-list/{waitlistId}/user/{email} | Remove user from waitlist |



## count

> WaitListUserCountResponseDto count(waitlistId)

Get waitlist user counts

Returns total user count and referred user count for a waitlist.

### Example

```ts
import {
  Configuration,
  WaitListUsersApi,
} from '@repo/zot-api-sdk';
import type { CountRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WaitListUsersApi(config);

  const body = {
    // object | Waitlist MongoDB ObjectId
    waitlistId: Object,
  } satisfies CountRequest;

  try {
    const data = await api.count(body);
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
| **waitlistId** | `object` | Waitlist MongoDB ObjectId | [Defaults to `undefined`] |

### Return type

[**WaitListUserCountResponseDto**](WaitListUserCountResponseDto.md)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Waitlist counts retrieved successfully |  -  |
| **401** | Not authenticated or not the waitlist owner |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## findByEmail

> WaitListUserResponseDto findByEmail(waitlistId, email)

Search user by email

Finds a specific user in the waitlist by their email address.

### Example

```ts
import {
  Configuration,
  WaitListUsersApi,
} from '@repo/zot-api-sdk';
import type { FindByEmailRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WaitListUsersApi(config);

  const body = {
    // object | Waitlist MongoDB ObjectId
    waitlistId: Object,
    // string | Email address to search for
    email: user@example.com,
  } satisfies FindByEmailRequest;

  try {
    const data = await api.findByEmail(body);
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
| **waitlistId** | `object` | Waitlist MongoDB ObjectId | [Defaults to `undefined`] |
| **email** | `string` | Email address to search for | [Defaults to `undefined`] |

### Return type

[**WaitListUserResponseDto**](WaitListUserResponseDto.md)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User found |  -  |
| **401** | Not authenticated or not the waitlist owner |  -  |
| **404** | User not found in waitlist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## waitListUsersFindAll

> Array&lt;WaitListUserResponseDto&gt; waitListUsersFindAll(waitlistId)

Get all waitlist users

Retrieves all users registered in a specific waitlist. Requires owner authentication.

### Example

```ts
import {
  Configuration,
  WaitListUsersApi,
} from '@repo/zot-api-sdk';
import type { WaitListUsersFindAllRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WaitListUsersApi(config);

  const body = {
    // object | Waitlist MongoDB ObjectId
    waitlistId: Object,
  } satisfies WaitListUsersFindAllRequest;

  try {
    const data = await api.waitListUsersFindAll(body);
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
| **waitlistId** | `object` | Waitlist MongoDB ObjectId | [Defaults to `undefined`] |

### Return type

[**Array&lt;WaitListUserResponseDto&gt;**](WaitListUserResponseDto.md)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of waitlist users retrieved successfully |  -  |
| **401** | Not authenticated or not the waitlist owner |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## waitListUsersRegister

> WaitListUserResponseDto waitListUsersRegister(waitlistId, registerWaitListUserDto)

Register for a waitlist

Allows a user to register for a waitlist. This is a public endpoint that does not require authentication.

### Example

```ts
import {
  Configuration,
  WaitListUsersApi,
} from '@repo/zot-api-sdk';
import type { WaitListUsersRegisterRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new WaitListUsersApi();

  const body = {
    // object | Waitlist MongoDB ObjectId
    waitlistId: Object,
    // RegisterWaitListUserDto
    registerWaitListUserDto: ...,
  } satisfies WaitListUsersRegisterRequest;

  try {
    const data = await api.waitListUsersRegister(body);
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
| **waitlistId** | `object` | Waitlist MongoDB ObjectId | [Defaults to `undefined`] |
| **registerWaitListUserDto** | [RegisterWaitListUserDto](RegisterWaitListUserDto.md) |  | |

### Return type

[**WaitListUserResponseDto**](WaitListUserResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | User successfully registered to waitlist |  -  |
| **404** | Waitlist not found or not available |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## waitListUsersRemove

> waitListUsersRemove(waitlistId, email)

Remove user from waitlist

Removes a user from the waitlist by their email address.

### Example

```ts
import {
  Configuration,
  WaitListUsersApi,
} from '@repo/zot-api-sdk';
import type { WaitListUsersRemoveRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WaitListUsersApi(config);

  const body = {
    // object | Waitlist MongoDB ObjectId
    waitlistId: Object,
    // string | Email address of the user to remove
    email: user@example.com,
  } satisfies WaitListUsersRemoveRequest;

  try {
    const data = await api.waitListUsersRemove(body);
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
| **waitlistId** | `object` | Waitlist MongoDB ObjectId | [Defaults to `undefined`] |
| **email** | `string` | Email address of the user to remove | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User removed from waitlist successfully |  -  |
| **401** | Not authenticated or not the waitlist owner |  -  |
| **404** | User not found in waitlist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

