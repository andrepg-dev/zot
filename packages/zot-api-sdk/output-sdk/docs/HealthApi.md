# HealthApi

All URIs are relative to *http://localhost:3010*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**main**](HealthApi.md#main) | **GET** /v1 | Health check |



## main

> string main()

Health check

Returns a welcome message. Use this endpoint to verify the API is running.

### Example

```ts
import {
  Configuration,
  HealthApi,
} from '@repo/zot-api-sdk';
import type { MainRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new HealthApi();

  try {
    const data = await api.main();
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

**string**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | API is healthy and running |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

