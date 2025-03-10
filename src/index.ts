import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { getActiveFile } from './tools/get-active-file.ts'
import { deleteActiveFile } from './tools/delete-active-file.ts'
import { insertActiveFile } from './tools/insert-active-file.ts'
import { insertFile } from './tools/insert-file.ts'
import { appendActiveFile } from './tools/append-active-file.ts'
import { openFile } from './tools/open-file.ts'
import { listFiles } from './tools/list-files.ts'
import { searchSimple } from './tools/search-simple.ts'

const server = new McpServer({
  name: 'Obsidian server',
  version: '0.0.1',
})

server.tool('get_active_file', 'Returns the content of the currently active file in Obsidian.', getActiveFile)

server.tool('delete_active_file', 'Deletes the currently active file in Obsidian.', deleteActiveFile)

server.tool(
  'insert_active_file',
  `
Allows you to modify the content relative to a heading, block reference, or frontmatter field in your document.

Examples
All of the below examples assume you have a document that looks like this:

---
alpha: 1
beta: test
delta:
zeta: 1
yotta: 1
gamma:
- one
- two
---

# Heading 1

This is the content for heading one

Also references some [[#^484ef2]]

## Subheading 1:1
Content for Subheading 1:1

### Subsubheading 1:1:1

### Subsubheading 1:1:2

Testing how block references work for a table.[[#^2c7cfa]]
Some content for Subsubheading 1:1:2

More random text.

^2d9b4a

## Subheading 1:2

Content for Subheading 1:2.

some content with a block reference ^484ef2

## Subheading 1:3
| City         | Population |
| ------------ | ---------- |
| Seattle, WA  | 8          |
| Portland, OR | 4          |

^2c7cfa
Append Content Below a Heading
If you wanted to append the content "Hello" below "Subheading 1:1:1" under "Heading 1", you could send a request with the following headers:

Operation: append
Target-Type: heading
Target: Heading 1::Subheading 1:1:1
with the request body: Hello
The above would work just fine for prepend or replace, too, of course, but with different results.

Append Content to a Block Reference
If you wanted to append the content "Hello" below the block referenced by "2d9b4a" above ("More random text."), you could send the following headers:

Operation: append
Target-Type: block
Target: 2d9b4a
with the request body: Hello
The above would work just fine for prepend or replace, too, of course, but with different results.

Add a Row to a Table Referenced by a Block Reference
If you wanted to add a new city ("Chicago, IL") and population ("16") pair to the table above referenced by the block reference 2c7cfa, you could send the following headers:

Operation: append
TargetType: block
Target: 2c7cfa
Content-Type: application/json
with the request body: [["Chicago, IL", "16"]]
The use of a Content-Type of application/json allows the API to infer that member of your array represents rows and columns of your to append to the referenced table. You can of course just use a Content-Type of text/markdown, but in such a case you'll have to format your table row manually instead of letting the library figure it out for you.

You also have the option of using prepend (in which case, your new row would be the first -- right below the table heading) or replace (in which case all rows except the table heading would be replaced by the new row(s) you supplied).

Setting a Frontmatter Field
If you wanted to set the frontmatter field alpha to 2, you could send the following headers:

Operation: replace
TargetType: frontmatter
Target: beep
with the request body 2
If you're setting a frontmatter field that might not already exist you may want to use the Create-Target-If-Missing header so the new frontmatter field is created and set to your specified value if it doesn't already exist.
`,
  {
    Operation: z.enum(['append', 'prepend', 'replace']),
    TargetType: z.enum(['heading', 'block', 'frontmatter']),
    Target: z.string(),
    requestBody: z.string(),
    'Target-Delimiter': z.string().optional(),
    'Trim-Target-Whitespace': z.enum(['true', 'false']).optional(),
    'Content-Type': z.enum(['text/plain', 'application/json', 'text/markdown']).optional(),
    'Create-Target-If-Missing': z.enum(['true', 'false']).optional(),
  },
  insertActiveFile,
)

server.tool(
  'append_active_file',
  'Appends content to the end of the currently-open note.',
  { content: z.string() },
  appendActiveFile,
)

server.tool('open_file', 'Opens a file in Obsidian.', { filename: z.string() }, openFile)

server.tool(
  'insert_file',
  `Insert content into an existing note relative to a heading within your note.
        
  Allows you to modify the content relative to a heading, block reference, or frontmatter field in your document.`,
  {
    filename: z.string(),
    Operation: z.enum(['append', 'prepend', 'replace']),
    TargetType: z.enum(['heading', 'block', 'frontmatter']),
    Target: z.string(),
    requestBody: z.string(),
    'Target-Delimiter': z.string().optional(),
    'Trim-Target-Whitespace': z.enum(['true', 'false']).optional(),
    'Content-Type': z.enum(['text/plain', 'application/json', 'text/markdown']).optional(),
    'Create-Target-If-Missing': z.enum(['true', 'false']).optional(),
  },
  insertFile,
)

server.tool(
  'search_simple',
  'Search for documents matching a specified text query',
  { query: z.string(), contextLength: z.number() },
  searchSimple,
)

server.tool('list_files', 'Lists files in a directory', { directory: z.string().default('.') }, listFiles)

const transport = new StdioServerTransport()
await server.connect(transport)
