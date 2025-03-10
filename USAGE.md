# Using MCP-Obsidian

This guide explains how to use the MCP-Obsidian integration with AI assistants.

## Setup

1. Ensure you have the [Obsidian Local REST API plugin](https://github.com/coddingtonbear/obsidian-local-rest-api) installed and configured in your Obsidian vault.

2. Configure your `.env` file with the correct `OBSIDIAN_BASE_URL` and `OBSIDIAN_TOKEN` from the plugin settings.

3. Start the MCP server:

   ```bash
   bun run src/index.ts
   ```

4. Connect your MCP-compatible AI assistant to this server.

## Working with Tools

### Reading Content

#### Get Active File

Retrieves the content of the currently active file in Obsidian.

```javascript
mcp__get_active_file({ random_string: "any" });
```

### Modifying Content

#### Delete Active File

Deletes the currently active file in Obsidian.

```javascript
mcp__delete_active_file({ random_string: "any" });
```

#### Insert Content at Specific Positions

Modifies content relative to a heading, block reference, or frontmatter field in your document.

```javascript
mcp__insert_active_file({
  Operation: "append", // or "prepend" or "replace"
  TargetType: "heading", // or "block" or "frontmatter"
  Target: "Heading 1::Subheading 1:1",
  requestBody: "Your content here",
});
```

Examples:

1. **Append to a heading**

   ```javascript
   mcp__insert_active_file({
     Operation: "append",
     TargetType: "heading",
     Target: "Tasks",
     requestBody: "- [ ] New task",
   });
   ```

2. **Replace frontmatter field**

   ```javascript
   mcp__insert_active_file({
     Operation: "replace",
     TargetType: "frontmatter",
     Target: "tags",
     requestBody: ["note", "important"],
   });
   ```

3. **Prepend to a block reference**
   ```javascript
   mcp__insert_active_file({
     Operation: "prepend",
     TargetType: "block",
     Target: "2d9b4a",
     requestBody: "Content to add before the referenced block.",
   });
   ```

#### Append to Active File

Appends content to the end of the currently open note.

```javascript
mcp__append_active_file({
  content: "Content to append at the end of the file",
});
```

### Navigation

#### Open File

Opens a file in Obsidian.

```javascript
mcp__open_file({
  filename: "path/to/your/note.md",
});
```

### Finding Content

#### Search Simple

Search for documents matching a text query.

```javascript
mcp__search_simple({
  query: "your search query",
  contextLength: 100, // Number of characters of context to include
});
```

#### List Files

Lists files in the root directory of your vault.

```javascript
mcp__list_files({ random_string: "any" });
```

#### List Directory Files

Lists files in a specific directory of your vault.

```javascript
mcp__list_directory_files({
  directory: "path/to/directory",
});
```

## Tips for Effective Use

1. **Working with Obsidian Structure**: Use headings and blocks effectively to create structured notes that are easily manipulable through the API.

2. **Block References**: Add block references (^id) to important paragraphs or tables to make them easy to target.

3. **Frontmatter**: Use frontmatter for metadata that you want AI assistants to be able to read or modify.

4. **Hierarchical Navigation**: Create a clear hierarchy with headings and subheadings to make navigation easier.
