
# WaitListResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`sendEmailToNewSignup` | boolean
`webhook` | object
`widgetId` | string
`isAvailable` | boolean
`userId` | string
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { WaitListResponseDto } from '@repo/zot-api-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": 507f1f77bcf86cd799439011,
  "name": Product Launch Waitlist,
  "sendEmailToNewSignup": true,
  "webhook": https://your-server.com/webhooks/waitlist,
  "widgetId": 507f1f77bcf86cd799439011,
  "isAvailable": true,
  "userId": 507f1f77bcf86cd799439011,
  "createdAt": 2024-01-15T10:30Z,
  "updatedAt": 2024-01-15T10:30Z,
} satisfies WaitListResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WaitListResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


