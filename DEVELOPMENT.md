# Development Guide

This document provides information for developers who want to contribute to the MCP-Obsidian project.

## Project Overview

MCP-Obsidian is a server implementation of the [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/protocol) for Obsidian. It enables AI assistants to interact with Obsidian notes through a standardized interface.

## Architecture

The project follows a simple architecture:

1. **Main Server (src/index.ts)**: Initializes the MCP server and registers all available tools.
2. **Tool Implementations (src/tools/\*)**: Each tool is implemented in its own file with a consistent structure.
3. **Configuration (src/tools/config.ts)**: Common configuration and utilities for tool implementations.

## Setting Up the Development Environment

1. Install dependencies:

   ```bash
   bun install
   ```

2. Copy the example environment file and configure it:

   ```bash
   cp .env.example .env
   ```

3. For development, you can set `DEBUG=true` in your `.env` file to see detailed logs.

## Creating a New Tool

To add a new tool to the MCP-Obsidian server:

1. Create a new TypeScript file in the `src/tools/` directory (e.g., `my-new-tool.ts`).

2. Implement your tool using the following template:

```typescript
import { McpToolDefinition } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makeRequest } from "./config.ts";

// Define the input schema for your tool
const MyToolInputSchema = z.object({
  // Define your parameters here
  param1: z.string().describe("Description of parameter 1"),
  param2: z.number().optional().describe("Description of parameter 2"),
});

// Define the output schema for your tool (optional)
const MyToolOutputSchema = z.object({
  // Define your return structure here
  result: z.string(),
});

// Implement the tool function
export const myNewTool: McpToolDefinition<
  typeof MyToolInputSchema,
  typeof MyToolOutputSchema
> = {
  input: MyToolInputSchema,
  output: MyToolOutputSchema, // Optional if you don't need to validate output

  async handler(params) {
    try {
      // Implement your tool logic here
      const response = await makeRequest("/your-obsidian-endpoint", {
        method: "POST",
        body: JSON.stringify({
          // Your request body
        }),
      });

      // Process the response
      const data = await response.json();

      // Return the result
      return { result: data.someValue };
    } catch (error) {
      console.error("Error in myNewTool:", error);
      throw error;
    }
  },
};
```

3. Register your tool in `src/index.ts`:

```typescript
import { myNewTool } from "./tools/my-new-tool.ts";

// Add this with the other tool registrations
server.tool("my_new_tool", "Description of what your tool does", myNewTool);
```

## Testing Your Changes

1. Start the MCP server:

   ```bash
   bun run src/index.ts
   ```

2. Test your changes by connecting an MCP-compatible AI assistant to your server.

## Debugging

For easier debugging:

1. Set `DEBUG=true` in your `.env` file.
2. You can also modify the `makeRequest` function in `config.ts` to add additional logging.
3. Use `console.log` statements to track execution flow (but remember to remove them before submitting).

## Code Style and Best Practices

1. Follow the TypeScript conventions used in the existing codebase.
2. Use descriptive parameter and function names.
3. Add appropriate error handling to your tools.
4. Include detailed descriptions for each parameter in your schema.
5. Keep your tool implementations focused on a single responsibility.

## Pull Request Process

1. Fork the repository and create a feature branch for your changes.
2. Make your changes following the guidelines above.
3. Test your changes thoroughly.
4. Submit a pull request with a clear description of the changes and their purpose.

## Integrating with Obsidian Local REST API

This project relies on the [Obsidian Local REST API plugin](https://github.com/coddingtonbear/obsidian-local-rest-api). Refer to their documentation for details on available endpoints and authentication requirements.

The `makeRequest` utility function in `config.ts` handles the API interaction details, including authentication with your token.
