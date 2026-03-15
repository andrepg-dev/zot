# UserQuoteApi

All URIs are relative to *http://localhost:3010*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**findUserQuote**](UserQuoteApi.md#finduserquote) | **GET** /v1/user-quote |  |
| [**getUsageHistory**](UserQuoteApi.md#getusagehistory) | **GET** /v1/user-quote/history |  |



## findUserQuote

> findUserQuote()



### Example

```ts
import {
  Configuration,
  UserQuoteApi,
} from '@repo/zot-api-sdk';
import type { FindUserQuoteRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new UserQuoteApi();

  try {
    const data = await api.findUserQuote();
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


## getUsageHistory

> getUsageHistory(service, from, to, limit)



### Example

```ts
import {
  Configuration,
  UserQuoteApi,
} from '@repo/zot-api-sdk';
import type { GetUsageHistoryRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new UserQuoteApi();

  const body = {
    // string
    service: service_example,
    // string
    from: from_example,
    // string
    to: to_example,
    // string
    limit: limit_example,
  } satisfies GetUsageHistoryRequest;

  try {
    const data = await api.getUsageHistory(body);
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
| **service** | `string` |  | [Defaults to `undefined`] |
| **from** | `string` |  | [Defaults to `undefined`] |
| **to** | `string` |  | [Defaults to `undefined`] |
| **limit** | `string` |  | [Defaults to `undefined`] |

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

