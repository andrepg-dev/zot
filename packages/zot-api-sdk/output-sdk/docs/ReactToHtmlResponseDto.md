
# ReactToHtmlResponseDto


## Properties

Name | Type
------------ | -------------
`html` | string

## Example

```typescript
import type { ReactToHtmlResponseDto } from '@repo/zot-api-sdk'

// TODO: Update the object below with actual values
const example = {
  "html": <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head></head>
  <body>
    <div style="max-width:600px;margin:0 auto">
      <p>Hello World!</p>
    </div>
  </body>
</html>,
} satisfies ReactToHtmlResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ReactToHtmlResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


