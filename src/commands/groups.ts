import { Command } from 'commander';
import { ZammadClient } from '../lib/zammad-client';
import { getConfig } from '../lib/config';

export function groupCommands(program: Command) {
  const groups = program
    .command('groups')
    .description('Manage Zammad groups');

  groups
    .command('list')
    .description('List all groups')
    .action(async () => {
      try {
        const config = getConfig();
        const client = new ZammadClient(config);
        const groupList = await client.getGroups();

        if (groupList.length === 0) {
          console.log('No groups found.');
          return;
        }

        console.log(`Found ${groupList.length} groups:\n`);
        groupList.forEach((group) => {
          console.log(`${group.name}`);
          console.log(`  ID: ${group.id}`);
          console.log(`  Active: ${group.active ? 'Yes' : 'No'}`);
          console.log('');
        });
      } catch (error: any) {
        console.error('Error fetching groups:', error.message);
        process.exit(1);
      }
    });

  groups
    .command('get <id>')
    .description('Get a specific group by ID')
    .action(async (id) => {
      try {
        const config = getConfig();
        const client = new ZammadClient(config);
        const group = await client.getGroup(parseInt(id));

        console.log('Group Details:');
        console.log('══════════════\n');
        console.log(`Name: ${group.name}`);
        console.log(`ID: ${group.id}`);
        console.log(`Active: ${group.active ? 'Yes' : 'No'}`);
        console.log(`Created: ${group.created_at}`);
        console.log(`Updated: ${group.updated_at}`);
      } catch (error: any) {
        console.error('Error fetching group:', error.message);
        process.exit(1);
      }
    });
}
