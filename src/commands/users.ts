import { Command } from 'commander';
import { ZammadClient } from '../lib/zammad-client';
import { getConfig } from '../lib/config';

export function userCommands(program: Command) {
  const users = program
    .command('users')
    .description('Manage Zammad users');

  users
    .command('list')
    .description('List all users')
    .action(async () => {
      try {
        const config = getConfig();
        const client = new ZammadClient(config);
        const userList = await client.getUsers();

        if (userList.length === 0) {
          console.log('No users found.');
          return;
        }

        console.log(`Found ${userList.length} users:\n`);
        userList.forEach((user) => {
          console.log(`${user.firstname} ${user.lastname} (${user.login})`);
          console.log(`  ID: ${user.id}`);
          console.log(`  Email: ${user.email}`);
          console.log(`  Active: ${user.active ? 'Yes' : 'No'}`);
          console.log('');
        });
      } catch (error: any) {
        console.error('Error fetching users:', error.message);
        process.exit(1);
      }
    });

  users
    .command('get <id>')
    .description('Get a specific user by ID')
    .action(async (id) => {
      try {
        const config = getConfig();
        const client = new ZammadClient(config);
        const user = await client.getUser(parseInt(id));

        console.log('User Details:');
        console.log('═════════════\n');
        console.log(`Name: ${user.firstname} ${user.lastname}`);
        console.log(`Login: ${user.login}`);
        console.log(`Email: ${user.email}`);
        console.log(`ID: ${user.id}`);
        console.log(`Active: ${user.active ? 'Yes' : 'No'}`);
        console.log(`Created: ${user.created_at}`);
        console.log(`Updated: ${user.updated_at}`);
      } catch (error: any) {
        console.error('Error fetching user:', error.message);
        process.exit(1);
      }
    });

  users
    .command('me')
    .description('Get current user information')
    .action(async () => {
      try {
        const config = getConfig();
        const client = new ZammadClient(config);
        const user = await client.getCurrentUser();

        console.log('Current User:');
        console.log('═════════════\n');
        console.log(`Name: ${user.firstname} ${user.lastname}`);
        console.log(`Login: ${user.login}`);
        console.log(`Email: ${user.email}`);
        console.log(`ID: ${user.id}`);
      } catch (error: any) {
        console.error('Error fetching current user:', error.message);
        process.exit(1);
      }
    });
}
