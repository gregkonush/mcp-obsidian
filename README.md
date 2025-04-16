# MCP Obsidian

[![smithery badge](https://smithery.ai/badge/@gregkonush/mcp-obsidian)](https://smithery.ai/server/@gregkonush/mcp-obsidian)

A server implementation of the [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/protocol) for integrating with [Obsidian](https://obsidian.md/). This allows AI assistants to read, create, and manipulate notes in your Obsidian vault.

## Features

- Read the active file in Obsidian
- Delete the active file
- Insert content at specific positions (headings, block references, frontmatter)
- Append content to files
- Open specific files
- List files in your vault
- Search through your notes

## Prerequisites

- [Bun](https://bun.sh/) runtime
- [Obsidian](https://obsidian.md/) desktop application
- An MCP-compatible AI assistant

## Add to cursor
Place your secret in .env file

Choose command MCP and then enter this command

```
bun __REPO_PATH__/src/index.ts
```

## Installation

### Installing via Smithery

To install Obsidian Integration Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@gregkonush/mcp-obsidian):

```bash
npx -y @smithery/cli install @gregkonush/mcp-obsidian --client claude
```

### Manual Installation
1. Clone this repository:

   ```bash
   git clone https://github.com/gregkonush/mcp-obsidian.git
   cd mcp-obsidian
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```

## Configuration

Edit the `.env` file with your specific configurations:

```
OBSIDIAN_BASE_URL=http://localhost:27123
OBSIDIAN_TOKEN=your_token_here
DEBUG=false
```

## Usage

Start the MCP server:

```bash
bun run src/index.ts
```

The server will start and communicate with MCP-compatible AI assistants via standard I/O.

## Available Tools

This implementation provides the following tools to AI assistants:

- `get_active_file` - Returns the content of the currently active file
- `delete_active_file` - Deletes the currently active file
- `insert_active_file` - Modifies content relative to a heading, block reference, or frontmatter field
- `append_active_file` - Appends content to the end of the active file
- `open_file` - Opens a specific file in Obsidian
- `search_simple` - Searches for documents matching a text query
- `list_files` - Lists files in the root directory of your vault
- `list_directory_files` - Lists files in a specific directory of your vault

## Development

### Project Structure

```
mcp-obsidian/
├── src/
│   ├── index.ts            # Main server implementation
│   └── tools/              # Individual tool implementations
│       ├── get-active-file.ts
│       ├── delete-active-file.ts
│       └── ...
├── .env                    # Environment configuration
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

### Adding New Tools

To add a new tool:

1. Create a new file in the `src/tools/` directory
2. Implement the tool using the MCP SDK
3. Import and register the tool in `src/index.ts`

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
