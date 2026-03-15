
# AccessTokenResponseDto


## Properties

Name | Type
------------ | -------------
`accessToken` | string

## Example

```typescript
import type { AccessTokenResponseDto } from '@repo/zot-api-sdk'

// TODO: Update the object below with actual values
const example = {
  "accessToken": eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...,
} satisfies AccessTokenResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AccessTokenResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


