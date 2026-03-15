# EmailTemplatesApi

All URIs are relative to *http://localhost:3010*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**emailTemplatesCreate**](EmailTemplatesApi.md#emailtemplatescreate) | **POST** /v1/email-templates |  |
| [**emailTemplatesFindAll**](EmailTemplatesApi.md#emailtemplatesfindall) | **GET** /v1/email-templates |  |
| [**emailTemplatesFindOne**](EmailTemplatesApi.md#emailtemplatesfindone) | **GET** /v1/email-templates/{id} |  |
| [**emailTemplatesRemove**](EmailTemplatesApi.md#emailtemplatesremove) | **DELETE** /v1/email-templates/{id} |  |
| [**emailTemplatesUpdate**](EmailTemplatesApi.md#emailtemplatesupdate) | **PATCH** /v1/email-templates/{id} |  |



## emailTemplatesCreate

> emailTemplatesCreate(body)



### Example

```ts
import {
  Configuration,
  EmailTemplatesApi,
} from '@repo/zot-api-sdk';
import type { EmailTemplatesCreateRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new EmailTemplatesApi();

  const body = {
    // object
    body: Object,
  } satisfies EmailTemplatesCreateRequest;

  try {
    const data = await api.emailTemplatesCreate(body);
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
| **body** | `object` |  | |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## emailTemplatesFindAll

> emailTemplatesFindAll()



### Example

```ts
import {
  Configuration,
  EmailTemplatesApi,
} from '@repo/zot-api-sdk';
import type { EmailTemplatesFindAllRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new EmailTemplatesApi();

  try {
    const data = await api.emailTemplatesFindAll();
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


## emailTemplatesFindOne

> emailTemplatesFindOne(id)



### Example

```ts
import {
  Configuration,
  EmailTemplatesApi,
} from '@repo/zot-api-sdk';
import type { EmailTemplatesFindOneRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new EmailTemplatesApi();

  const body = {
    // object
    id: Object,
  } satisfies EmailTemplatesFindOneRequest;

  try {
    const data = await api.emailTemplatesFindOne(body);
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
| **id** | `object` |  | [Defaults to `undefined`] |

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


## emailTemplatesRemove

> emailTemplatesRemove(id)



### Example

```ts
import {
  Configuration,
  EmailTemplatesApi,
} from '@repo/zot-api-sdk';
import type { EmailTemplatesRemoveRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new EmailTemplatesApi();

  const body = {
    // object
    id: Object,
  } satisfies EmailTemplatesRemoveRequest;

  try {
    const data = await api.emailTemplatesRemove(body);
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
| **id** | `object` |  | [Defaults to `undefined`] |

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


## emailTemplatesUpdate

> emailTemplatesUpdate(id, body)



### Example

```ts
import {
  Configuration,
  EmailTemplatesApi,
} from '@repo/zot-api-sdk';
import type { EmailTemplatesUpdateRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new EmailTemplatesApi();

  const body = {
    // object
    id: Object,
    // object
    body: Object,
  } satisfies EmailTemplatesUpdateRequest;

  try {
    const data = await api.emailTemplatesUpdate(body);
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
| **id** | `object` |  | [Defaults to `undefined`] |
| **body** | `object` |  | |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

