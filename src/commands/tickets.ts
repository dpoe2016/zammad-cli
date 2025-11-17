import { Command } from 'commander';
import { ZammadClient } from '../lib/zammad-client';
import { getConfig } from '../lib/config';

export function ticketCommands(program: Command) {
  const tickets = program
    .command('tickets')
    .description('Manage Zammad tickets');

  tickets
    .command('list')
    .description('List all tickets')
    .option('-p, --page <number>', 'Page number', '1')
    .option('-l, --limit <number>', 'Tickets per page', '10')
    .option('-e, --expand', 'Expand ticket details', false)
    .action(async (options) => {
      try {
        const config = getConfig();
        const client = new ZammadClient(config);
        const ticketList = await client.getTickets({
          page: parseInt(options.page),
          per_page: parseInt(options.limit),
          expand: options.expand,
        });

        if (ticketList.length === 0) {
          console.log('No tickets found.');
          return;
        }

        console.log(`Found ${ticketList.length} tickets:\n`);
        ticketList.forEach((ticket) => {
          console.log(`#${ticket.number} - ${ticket.title}`);
          console.log(`  ID: ${ticket.id}`);
          console.log(`  State: ${ticket.state || ticket.state_id}`);
          console.log(`  Priority: ${ticket.priority || ticket.priority_id}`);
          console.log(`  Updated: ${ticket.updated_at}`);
          console.log('');
        });
      } catch (error: any) {
        console.error('Error fetching tickets:', error.message);
        process.exit(1);
      }
    });

  tickets
    .command('get <id>')
    .description('Get a specific ticket by ID')
    .action(async (id) => {
      try {
        const config = getConfig();
        const client = new ZammadClient(config);
        const ticket = await client.getTicket(parseInt(id));

        console.log('Ticket Details:');
        console.log('═══════════════\n');
        console.log(`Number: #${ticket.number}`);
        console.log(`Title: ${ticket.title}`);
        console.log(`ID: ${ticket.id}`);
        console.log(`State: ${ticket.state || ticket.state_id}`);
        console.log(`Priority: ${ticket.priority || ticket.priority_id}`);
        console.log(`Group: ${ticket.group || ticket.group_id}`);
        console.log(`Owner: ${ticket.owner || ticket.owner_id}`);
        console.log(`Customer: ${ticket.customer || ticket.customer_id}`);
        console.log(`Created: ${ticket.created_at}`);
        console.log(`Updated: ${ticket.updated_at}`);
      } catch (error: any) {
        console.error('Error fetching ticket:', error.message);
        process.exit(1);
      }
    });

  tickets
    .command('search <query>')
    .description('Search for tickets')
    .action(async (query) => {
      try {
        const config = getConfig();
        const client = new ZammadClient(config);
        const results = await client.searchTickets(query);

        if (results.length === 0) {
          console.log('No tickets found matching your query.');
          return;
        }

        console.log(`Found ${results.length} tickets:\n`);
        results.forEach((ticket) => {
          console.log(`#${ticket.number} - ${ticket.title}`);
          console.log(`  ID: ${ticket.id}`);
          console.log(`  State: ${ticket.state || ticket.state_id}`);
          console.log('');
        });
      } catch (error: any) {
        console.error('Error searching tickets:', error.message);
        process.exit(1);
      }
    });

  tickets
    .command('create')
    .description('Create a new ticket')
    .requiredOption('-t, --title <title>', 'Ticket title')
    .requiredOption('-g, --group <group>', 'Group ID')
    .option('-c, --customer <customer>', 'Customer ID')
    .option('-p, --priority <priority>', 'Priority ID', '2')
    .option('-s, --state <state>', 'State ID', '1')
    .action(async (options) => {
      try {
        const config = getConfig();
        const client = new ZammadClient(config);

        const ticketData: any = {
          title: options.title,
          group_id: parseInt(options.group),
          priority_id: parseInt(options.priority),
          state_id: parseInt(options.state),
        };

        if (options.customer) {
          ticketData.customer_id = parseInt(options.customer);
        }

        const ticket = await client.createTicket(ticketData);
        console.log(`Ticket created successfully!`);
        console.log(`Number: #${ticket.number}`);
        console.log(`ID: ${ticket.id}`);
      } catch (error: any) {
        console.error('Error creating ticket:', error.message);
        process.exit(1);
      }
    });
}
