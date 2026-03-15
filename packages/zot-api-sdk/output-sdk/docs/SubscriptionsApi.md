# SubscriptionsApi

All URIs are relative to *http://localhost:3010*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createCheckoutSession**](SubscriptionsApi.md#createcheckoutsession) | **POST** /v1/subscriptions/checkout-session | Create Stripe checkout session for Zot Premium |
| [**stripeWebhook**](SubscriptionsApi.md#stripewebhook) | **POST** /v1/subscriptions/webhook | Stripe webhook receiver |



## createCheckoutSession

> CheckoutSessionResponseDto createCheckoutSession(createCheckoutSessionDto)

Create Stripe checkout session for Zot Premium

Creates a Stripe-hosted checkout session for the current user subscription.

### Example

```ts
import {
  Configuration,
  SubscriptionsApi,
} from '@repo/zot-api-sdk';
import type { CreateCheckoutSessionRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: JWT-auth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SubscriptionsApi(config);

  const body = {
    // CreateCheckoutSessionDto (optional)
    createCheckoutSessionDto: ...,
  } satisfies CreateCheckoutSessionRequest;

  try {
    const data = await api.createCheckoutSession(body);
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
| **createCheckoutSessionDto** | [CreateCheckoutSessionDto](CreateCheckoutSessionDto.md) |  | [Optional] |

### Return type

[**CheckoutSessionResponseDto**](CheckoutSessionResponseDto.md)

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Checkout session created successfully |  -  |
| **401** | Not authenticated |  -  |
| **500** | Stripe error while creating session |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## stripeWebhook

> WebhookAcceptedResponseDto stripeWebhook()

Stripe webhook receiver

Receives Stripe events and keeps user plan and quotes synchronized.

### Example

```ts
import {
  Configuration,
  SubscriptionsApi,
} from '@repo/zot-api-sdk';
import type { StripeWebhookRequest } from '@repo/zot-api-sdk';

async function example() {
  console.log("🚀 Testing @repo/zot-api-sdk SDK...");
  const api = new SubscriptionsApi();

  try {
    const data = await api.stripeWebhook();
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

[**WebhookAcceptedResponseDto**](WebhookAcceptedResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Webhook accepted |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

