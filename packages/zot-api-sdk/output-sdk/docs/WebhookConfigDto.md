
# WebhookConfigDto


## Properties

Name | Type
------------ | -------------
`url` | string
`range` | number

## Example

```typescript
import type { WebhookConfigDto } from '@repo/zot-api-sdk'

// TODO: Update the object below with actual values
const example = {
  "url": https://your-server.com/webhooks/waitlist,
  "range": 10,
} satisfies WebhookConfigDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WebhookConfigDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


