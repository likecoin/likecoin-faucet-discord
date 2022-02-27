import { REST } from '@discordjs/rest';
import {
  Client,
  Intents,
  ClientOptions,
  Interaction,
  ApplicationCommand,
} from 'discord.js';
import { Routes } from 'discord-api-types/v10';
import ApplicationConfig from '../config/config';
import { Command } from '../models/discord/command';

interface DiscordClient {
  client: Client;
  run: () => void;
  registerCommandModule: (command: Command) => void;
}

const defaultOptions: ClientOptions = {
  intents: [Intents.FLAGS.GUILDS],
};

const DiscordClient = (options?: ClientOptions): DiscordClient => {
  const { discordToken, channelId } = ApplicationConfig;
  const client = new Client({ ...defaultOptions, options } as ClientOptions);
  const moduleList: Command[] = [];

  const registerCommands = async (
    clientToken: string,
    clientId: string,
    channelId: string,
  ): Promise<ApplicationCommand | null> => {
    const request = new REST({ version: '10' }).setToken(clientToken);

    const channel = await client.channels.fetch(channelId);

    if (!channel || channel.type !== 'GUILD_TEXT') {
      return null;
    }

    const commandJSONData = moduleList.map((c) => c.config.toJSON());

    return request.put(
      Routes.applicationGuildCommands(clientId, channel.guildId),
      {
        body: commandJSONData,
      },
    ) as Promise<ApplicationCommand>;
  };

  const onInteraction = async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const command = moduleList.find(
      (c) => c.config.name === interaction.commandName,
    );

    if (!command) return;

    await command.execute(interaction);
  };

  const onClientReady = async (client: Client) => {
    // TODO: Register all guilds that the bot exists in

    if (!client.user) {
      console.error('Unable to fetch bot user');
      return;
    }

    await registerCommands(discordToken, client.user.id, channelId);

    console.log('Faucet is up');
  };

  const registerCommandModule = (command: Command) => {
    moduleList.push(command);
  };

  const run = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    client.login(discordToken);
  };

  client.once('ready', onClientReady);
  client.on('interactionCreate', onInteraction);

  return { client, run, registerCommandModule };
};

export default DiscordClient;
