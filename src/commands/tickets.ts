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
    .description('Get a specific ticket by ID with all articles')
    .action(async (id) => {
      try {
        const config = getConfig();
        const client = new ZammadClient(config);
        const ticketId = parseInt(id);

        // Fetch ticket and articles in parallel
        const [ticket, articles] = await Promise.all([
          client.getTicket(ticketId),
          client.getTicketArticles(ticketId)
        ]);

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

        // Display articles
        if (articles.length > 0) {
          console.log(`\nArticles (${articles.length}):`);
          console.log('═══════════════════\n');

          articles.forEach((article, index) => {
            console.log(`Article #${index + 1} (ID: ${article.id})`);
            console.log(`From: ${article.from}`);
            if (article.to) console.log(`To: ${article.to}`);
            if (article.cc) console.log(`Cc: ${article.cc}`);
            if (article.subject) console.log(`Subject: ${article.subject}`);
            console.log(`Type: ${article.type || article.type_id}`);
            console.log(`Sender: ${article.sender || article.sender_id}`);
            console.log(`Internal: ${article.internal ? 'Yes' : 'No'}`);
            console.log(`Created: ${article.created_at}`);
            console.log(`Created by: ${article.created_by || article.created_by_id}`);
            console.log('\nBody:');
            console.log('─────────────────────');
            // Strip HTML tags for better readability in terminal
            const bodyText = article.body.replace(/<[^>]*>/g, '').trim();
            console.log(bodyText);
            console.log('─────────────────────\n');
          });
        } else {
          console.log('\nNo articles found for this ticket.');
        }
      } catch (error: any) {
        console.error('Error fetching ticket:', error.message);
        process.exit(1);
      }
    });

  tickets
    .command('search')
    .description('Search for tickets with advanced filters')
    .option('-q, --query <query>', 'Search query (searches in title and body)')
    .option('-s, --state <state>', 'Filter by state name or ID')
    .option('-p, --priority <priority>', 'Filter by priority name or ID')
    .option('-g, --group <group>', 'Filter by group name or ID')
    .option('-c, --customer <customer>', 'Filter by customer email or ID')
    .option('-o, --owner <owner>', 'Filter by owner email or ID')
    .option('-l, --limit <number>', 'Limit number of results', '50')
    .option('-d, --detailed', 'Show detailed results', false)
    .action(async (options) => {
      try {
        const config = getConfig();
        const client = new ZammadClient(config);

        // Build search query
        let searchQuery = '';
        const queryParts: string[] = [];

        if (options.query) {
          queryParts.push(`title:*${options.query}* OR body:*${options.query}*`);
        }

        if (options.state) {
          queryParts.push(`state.name:${options.state}`);
        }

        if (options.priority) {
          queryParts.push(`priority.name:${options.priority}`);
        }

        if (options.group) {
          queryParts.push(`group.name:${options.group}`);
        }

        if (options.customer) {
          queryParts.push(`customer.email:${options.customer}`);
        }

        if (options.owner) {
          queryParts.push(`owner.email:${options.owner}`);
        }

        if (queryParts.length === 0) {
          console.error('Please provide at least one search criterion.');
          console.log('Use --help to see available options.');
          process.exit(1);
        }

        searchQuery = queryParts.join(' AND ');

        console.log(`Searching with query: ${searchQuery}\n`);

        const results = await client.searchTickets(searchQuery);

        if (results.length === 0) {
          console.log('No tickets found matching your criteria.');
          return;
        }

        const limit = parseInt(options.limit);
        const limitedResults = results.slice(0, limit);

        console.log(`Found ${results.length} ticket(s), showing ${limitedResults.length}:\n`);

        limitedResults.forEach((ticket) => {
          console.log(`#${ticket.number} - ${ticket.title}`);
          console.log(`  ID: ${ticket.id}`);
          console.log(`  State: ${ticket.state || ticket.state_id}`);

          if (options.detailed) {
            console.log(`  Priority: ${ticket.priority || ticket.priority_id}`);
            console.log(`  Group: ${ticket.group || ticket.group_id}`);
            console.log(`  Customer: ${ticket.customer || ticket.customer_id}`);
            console.log(`  Owner: ${ticket.owner || ticket.owner_id}`);
            console.log(`  Created: ${ticket.created_at}`);
            console.log(`  Updated: ${ticket.updated_at}`);
          }

          console.log('');
        });

        if (results.length > limit) {
          console.log(`Showing ${limit} of ${results.length} results. Use --limit to show more.`);
        }
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
