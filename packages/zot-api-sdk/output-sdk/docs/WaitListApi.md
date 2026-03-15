# WaitListApi

All URIs are relative to *http://localhost:3010*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**waitListCreate**](WaitListApi.md#waitlistcreate) | **POST** /v1/wait-list | Create a new waitlist |
| [**waitListFindAll**](WaitListApi.md#waitlistfindall) | **GET** /v1/wait-list | Get all waitlists |
| [**waitListFindOne**](WaitListApi.md#waitlistfindone) | **GET** /v1/wait-list/{id} | Get a specific waitlist |
| [**waitListRemove**](WaitListApi.md#waitlistremove) | **DELETE** /v1/wait-list/{id} | Delete a waitlist |
| [**waitListUpdate**](WaitListApi.md#waitlistupdate) | **PATCH** /v1/wait-list/{id} | Update a waitlist |
| [**waitlistStats**](WaitListApi.md#waitliststats) | **GET** /v1/wait-list/{waitlistId}/stats | Get waitlist statistics |



## waitListCreate

> WaitListResponseDto waitListCreate(createWaitListDto)

Create a new waitlist

Creates a new waitlist for the authenticated user.

### Example

```ts
import {
  Configuration,
  WaitListApi,
} from '@repo/zot-api-sdk';
import type { WaitListCreateRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WaitListApi(config);

  const body = {
    // CreateWaitListDto
    createWaitListDto: ...,
  } satisfies WaitListCreateRequest;

  try {
    const data = await api.waitListCreate(body);
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
| **createWaitListDto** | [CreateWaitListDto](CreateWaitListDto.md) |  | |

### Return type

[**WaitListResponseDto**](WaitListResponseDto.md)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Waitlist created successfully |  -  |
| **401** | Not authenticated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## waitListFindAll

> Array&lt;WaitListResponseDto&gt; waitListFindAll()

Get all waitlists

Retrieves all waitlists owned by the authenticated user.

### Example

```ts
import {
  Configuration,
  WaitListApi,
} from '@repo/zot-api-sdk';
import type { WaitListFindAllRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WaitListApi(config);

  try {
    const data = await api.waitListFindAll();
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

[**Array&lt;WaitListResponseDto&gt;**](WaitListResponseDto.md)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of waitlists retrieved successfully |  -  |
| **401** | Not authenticated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## waitListFindOne

> WaitListResponseDto waitListFindOne(id)

Get a specific waitlist

Retrieves a specific waitlist by ID.

### Example

```ts
import {
  Configuration,
  WaitListApi,
} from '@repo/zot-api-sdk';
import type { WaitListFindOneRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WaitListApi(config);

  const body = {
    // object | Waitlist MongoDB ObjectId
    id: Object,
  } satisfies WaitListFindOneRequest;

  try {
    const data = await api.waitListFindOne(body);
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
| **id** | `object` | Waitlist MongoDB ObjectId | [Defaults to `undefined`] |

### Return type

[**WaitListResponseDto**](WaitListResponseDto.md)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Waitlist retrieved successfully |  -  |
| **401** | Not authenticated |  -  |
| **404** | Waitlist not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## waitListRemove

> waitListRemove(id)

Delete a waitlist

Permanently deletes a waitlist. This action cannot be undone.

### Example

```ts
import {
  Configuration,
  WaitListApi,
} from '@repo/zot-api-sdk';
import type { WaitListRemoveRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WaitListApi(config);

  const body = {
    // object | Waitlist MongoDB ObjectId
    id: Object,
  } satisfies WaitListRemoveRequest;

  try {
    const data = await api.waitListRemove(body);
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
| **id** | `object` | Waitlist MongoDB ObjectId | [Defaults to `undefined`] |

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
| **200** | Waitlist deleted successfully |  -  |
| **401** | Not authenticated |  -  |
| **404** | Waitlist not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## waitListUpdate

> WaitListResponseDto waitListUpdate(id, updateWaitListDto)

Update a waitlist

Updates an existing waitlist. Only the owner can update.

### Example

```ts
import {
  Configuration,
  WaitListApi,
} from '@repo/zot-api-sdk';
import type { WaitListUpdateRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WaitListApi(config);

  const body = {
    // object | Waitlist MongoDB ObjectId
    id: Object,
    // UpdateWaitListDto
    updateWaitListDto: ...,
  } satisfies WaitListUpdateRequest;

  try {
    const data = await api.waitListUpdate(body);
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
| **id** | `object` | Waitlist MongoDB ObjectId | [Defaults to `undefined`] |
| **updateWaitListDto** | [UpdateWaitListDto](UpdateWaitListDto.md) |  | |

### Return type

[**WaitListResponseDto**](WaitListResponseDto.md)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Waitlist updated successfully |  -  |
| **401** | Not authenticated |  -  |
| **404** | Waitlist not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## waitlistStats

> waitlistStats(waitlistId)

Get waitlist statistics

Retrieves aggregated statistics for a specific waitlist owned by the authenticated user.

### Example

```ts
import {
  Configuration,
  WaitListApi,
} from '@repo/zot-api-sdk';
import type { WaitlistStatsRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new WaitListApi(config);

  const body = {
    // object | Waitlist MongoDB ObjectId
    waitlistId: Object,
  } satisfies WaitlistStatsRequest;

  try {
    const data = await api.waitlistStats(body);
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

`void` (Empty response body)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Waitlist statistics retrieved successfully |  -  |
| **401** | Not authenticated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

