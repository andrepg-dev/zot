
# RegisterWaitListUserDto


## Properties

Name | Type
------------ | -------------
`email` | string
`referredBy` | string

## Example

```typescript
import type { RegisterWaitListUserDto } from '@repo/zot-api-sdk'

// TODO: Update the object below with actual values
const example = {
  "email": user@example.com,
  "referredBy": ref_abc123xyz,
} satisfies RegisterWaitListUserDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RegisterWaitListUserDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


