
# WaitListUserCountResponseDto


## Properties

Name | Type
------------ | -------------
`total` | number
`referred` | number

## Example

```typescript
import type { WaitListUserCountResponseDto } from '@repo/zot-api-sdk'

// TODO: Update the object below with actual values
const example = {
  "total": 1250,
  "referred": 320,
} satisfies WaitListUserCountResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WaitListUserCountResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


