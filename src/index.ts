#!/usr/bin/env node

import { Command } from 'commander';
import { ticketCommands } from './commands/tickets';
import { userCommands } from './commands/users';
import { groupCommands } from './commands/groups';

const program = new Command();

program
  .name('zm')
  .description('CLI tool for interacting with Zammad ticket systems')
  .version('1.0.0');

// Register command groups
ticketCommands(program);
userCommands(program);
groupCommands(program);

program.parse(process.argv);
