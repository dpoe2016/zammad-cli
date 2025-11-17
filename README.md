# Zammad CLI

A command-line tool for interacting with Zammad ticket systems. Built with TypeScript and designed for efficient ticket management and system administration.

## Features

- List, view, search, and create tickets
- Manage users and groups
- Full TypeScript support with type definitions
- Environment-based configuration
- Easy-to-use command structure

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Zammad instance with API access

### Setup

1. Clone or download this project:
```bash
cd zammad-cli
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on the example:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Zammad credentials:
```env
ZAMMAD_URL=https://your-zammad-instance.com
ZAMMAD_TOKEN=your-api-token-here
```

### Getting Your API Token

1. Log in to your Zammad instance
2. Go to Profile Settings
3. Navigate to "Token Access"
4. Create a new token with appropriate permissions
5. Copy the token to your `.env` file

## Building

Build the TypeScript project:
```bash
npm run build
```

## Usage

After building, you can run commands using:
```bash
npm start -- <command>
```

Or for development:
```bash
npm run dev -- <command>
```

For easier usage, you can install globally:
```bash
npm install -g .
```

Then use the `zm` command directly:
```bash
zm <command>
```

### Available Commands

#### Tickets

**List tickets:**
```bash
zm tickets list
zm tickets list --page 2 --limit 20
zm tickets list --expand
```

**Get a specific ticket:**
```bash
zm tickets get <ticket-id>
```

**Search tickets:**
```bash
zm tickets search "keyword"
```

**Create a ticket:**
```bash
zm tickets create --title "Issue title" --group 1 --customer 2
zm tickets create --title "Bug report" --group 1 --priority 3 --state 2
```

#### Users

**List all users:**
```bash
zm users list
```

**Get a specific user:**
```bash
zm users get <user-id>
```

**Get current user info:**
```bash
zm users me
```

#### Groups

**List all groups:**
```bash
zm groups list
```

**Get a specific group:**
```bash
zm groups get <group-id>
```

### Command Options

Most commands support additional options:

- `--help` - Show help for a command
- `-V, --version` - Show version number

## Development

### Project Structure

```
zammad-cli/
├── src/
│   ├── commands/         # Command implementations
│   │   ├── tickets.ts
│   │   ├── users.ts
│   │   └── groups.ts
│   ├── lib/             # Core libraries
│   │   ├── zammad-client.ts  # API client
│   │   └── config.ts         # Configuration loader
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   └── index.ts         # Main entry point
├── dist/                # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── .env                 # Your configuration (not in git)
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled CLI
- `npm run dev` - Run directly with ts-node (development)
- `npm run watch` - Watch mode for development

## API Client

The Zammad client (`src/lib/zammad-client.ts`) provides methods for:

### Tickets
- `getTickets(options)` - List tickets with pagination
- `getTicket(id)` - Get a single ticket
- `createTicket(data)` - Create a new ticket
- `updateTicket(id, data)` - Update a ticket
- `searchTickets(query)` - Search tickets

### Users
- `getUsers()` - List all users
- `getUser(id)` - Get a single user
- `getCurrentUser()` - Get current authenticated user

### Groups
- `getGroups()` - List all groups
- `getGroup(id)` - Get a single group

## Contributing

Feel free to extend the CLI with additional commands:

1. Add new commands in `src/commands/`
2. Import and register them in `src/index.ts`
3. Add corresponding methods to `ZammadClient` if needed
4. Update type definitions in `src/types/` as needed

## Error Handling

The CLI provides clear error messages for common issues:
- Missing configuration
- Invalid API credentials
- Network errors
- Invalid command usage

## License

MIT

## Support

For issues with:
- **This CLI tool**: Check your configuration and API token
- **Zammad API**: Refer to [Zammad API documentation](https://docs.zammad.org/en/latest/api/intro.html)
- **Zammad instance**: Contact your Zammad administrator
