# APIKeysApi

All URIs are relative to *http://localhost:3010*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**aPIKeysCreate**](APIKeysApi.md#apikeyscreate) | **POST** /v1/api-key | Create a new API key |
| [**aPIKeysFindAll**](APIKeysApi.md#apikeysfindall) | **GET** /v1/api-key | Get all API keys |
| [**aPIKeysFindOne**](APIKeysApi.md#apikeysfindone) | **GET** /v1/api-key/{id} | Get a specific API key |
| [**aPIKeysRemove**](APIKeysApi.md#apikeysremove) | **DELETE** /v1/api-key/{id} | Delete an API key |
| [**aPIKeysUpdate**](APIKeysApi.md#apikeysupdate) | **PATCH** /v1/api-key/{id} | Update an API key |



## aPIKeysCreate

> aPIKeysCreate(createApiKeyDto)

Create a new API key

Creates a new API key for the authenticated user.

### Example

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

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createApiKeyDto** | [CreateApiKeyDto](CreateApiKeyDto.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | API key created successfully |  -  |
| **401** | Not authenticated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## aPIKeysFindAll

> aPIKeysFindAll()

Get all API keys

Retrieves all API keys owned by the authenticated user.

### Example

```ts
import {
  Configuration,
  APIKeysApi,
} from '@repo/zot-api-sdk';
import type { APIKeysFindAllRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new APIKeysApi(config);

  try {
    const data = await api.aPIKeysFindAll();
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

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of API keys retrieved successfully |  -  |
| **401** | Not authenticated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## aPIKeysFindOne

> aPIKeysFindOne(id)

Get a specific API key

Retrieves a specific API key by ID.

### Example

```ts
import {
  Configuration,
  APIKeysApi,
} from '@repo/zot-api-sdk';
import type { APIKeysFindOneRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new APIKeysApi(config);

  const body = {
    // object | API key MongoDB ObjectId
    id: Object,
  } satisfies APIKeysFindOneRequest;

  try {
    const data = await api.aPIKeysFindOne(body);
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
| **id** | `object` | API key MongoDB ObjectId | [Defaults to `undefined`] |

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
| **200** | API key retrieved successfully |  -  |
| **401** | Not authenticated |  -  |
| **404** | API key not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## aPIKeysRemove

> aPIKeysRemove(id)

Delete an API key

Permanently deletes an API key. This action cannot be undone.

### Example

```ts
import {
  Configuration,
  APIKeysApi,
} from '@repo/zot-api-sdk';
import type { APIKeysRemoveRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new APIKeysApi(config);

  const body = {
    // object | API key MongoDB ObjectId
    id: Object,
  } satisfies APIKeysRemoveRequest;

  try {
    const data = await api.aPIKeysRemove(body);
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
| **id** | `object` | API key MongoDB ObjectId | [Defaults to `undefined`] |

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
| **200** | API key deleted successfully |  -  |
| **401** | Not authenticated |  -  |
| **404** | API key not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## aPIKeysUpdate

> aPIKeysUpdate(id, updateApiKeyDto)

Update an API key

Updates an existing API key. Only the owner can update.

### Example

```ts
import {
  Configuration,
  APIKeysApi,
} from '@repo/zot-api-sdk';
import type { APIKeysUpdateRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new APIKeysApi(config);

  const body = {
    // object | API key MongoDB ObjectId
    id: Object,
    // UpdateApiKeyDto
    updateApiKeyDto: ...,
  } satisfies APIKeysUpdateRequest;

  try {
    const data = await api.aPIKeysUpdate(body);
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
| **id** | `object` | API key MongoDB ObjectId | [Defaults to `undefined`] |
| **updateApiKeyDto** | [UpdateApiKeyDto](UpdateApiKeyDto.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | API key updated successfully |  -  |
| **401** | Not authenticated |  -  |
| **404** | API key not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

