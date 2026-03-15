
# WaitListUserResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`email` | string
`waitlistId` | string
`referredBy` | string
`referralCode` | string
`createdAt` | Date

## Example

```typescript
import type { WaitListUserResponseDto } from '@repo/zot-api-sdk'

// TODO: Update the object below with actual values
const example = {
  "id": 507f1f77bcf86cd799439011,
  "email": user@example.com,
  "waitlistId": 507f1f77bcf86cd799439011,
  "referredBy": ref_abc123xyz,
  "referralCode": ref_xyz789abc,
  "createdAt": 2024-01-15T10:30Z,
} satisfies WaitListUserResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WaitListUserResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


