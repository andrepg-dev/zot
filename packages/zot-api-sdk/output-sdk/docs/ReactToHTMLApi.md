# ReactToHTMLApi

All URIs are relative to *http://localhost:3010*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**compile**](ReactToHTMLApi.md#compile) | **POST** /v1/react2html | Compile React to HTML |



## compile

> ReactToHtmlResponseDto compile(reactToHtmlDto)

Compile React to HTML

Compiles React email components to static HTML.       This endpoint is useful for generating email templates using React Email components. The input should be valid React/JSX code that exports a default component.  **Supported packages:** - @react-email/components (Html, Head, Body, Container, Text, Button, etc.)

### Example

```ts
import {
  Configuration,
  ReactToHTMLApi,
} from '@repo/zot-api-sdk';
import type { CompileRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new ReactToHTMLApi();

  const body = {
    // ReactToHtmlDto
    reactToHtmlDto: ...,
  } satisfies CompileRequest;

  try {
    const data = await api.compile(body);
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
| **reactToHtmlDto** | [ReactToHtmlDto](ReactToHtmlDto.md) |  | |

### Return type

[**ReactToHtmlResponseDto**](ReactToHtmlResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | React component successfully compiled to HTML |  -  |
| **400** | Invalid React code or compilation error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

