
# CreateUserDto


## Properties

Name | Type
------------ | -------------
`name` | string
`lastName` | string
`email` | string
`password` | string
`avatar` | string

## Example

```typescript
import type { CreateUserDto } from '@repo/zot-api-sdk'

// TODO: Update the object below with actual values
const example = {
  "name": John,
  "lastName": Doe,
  "email": john.doe@example.com,
  "password": SecureP@ssw0rd!,
  "avatar": https://example.com/avatars/john-doe.jpg,
} satisfies CreateUserDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateUserDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


