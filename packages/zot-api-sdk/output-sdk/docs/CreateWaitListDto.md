
# CreateWaitListDto


## Properties

Name | Type
------------ | -------------
`name` | string
`sendEmailToNewSignup` | boolean
`webhook` | [WebhookConfigDto](WebhookConfigDto.md)
`widgetId` | string
`isAvailable` | boolean
`isSecurityActive` | boolean

## Example

```typescript
import type { CreateWaitListDto } from '@repo/zot-api-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": Product Launch Waitlist,
  "sendEmailToNewSignup": true,
  "webhook": null,
  "widgetId": 507f1f77bcf86cd799439011,
  "isAvailable": true,
  "isSecurityActive": true,
} satisfies CreateWaitListDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateWaitListDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


