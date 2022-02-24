import { REST } from "@discordjs/rest";
import { Client, Intents, ClientOptions, Interaction } from "discord.js";
import { Routes } from "discord-api-types/v10";
import { ModuleList } from "../command/modules";
import ApplicationConfig from "../config/config";

const defaultOptions: ClientOptions = {
  intents: [Intents.FLAGS.GUILDS],
};

const DiscordClient = (options?: ClientOptions) => {
  const { discordToken, channelId } = ApplicationConfig;
  const client = new Client({ ...defaultOptions, options } as ClientOptions);

  const registerCommands = async (
    clientToken: string,
    clientId: string,
    channelId: string
  ): Promise<any> => {
    const request = new REST({ version: "10" }).setToken(clientToken);

    const channel = await client.channels.fetch(channelId);

    if (channel.type !== "GUILD_TEXT") return;

    const commandJSONData = ModuleList.map((c) => c.config.toJSON());

    return request.put(
      Routes.applicationGuildCommands(clientId, channel.guildId),
      {
        body: commandJSONData,
      }
    );
  };

  const onInteraction = async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const command = ModuleList.find(
      (c) => c.config.name === interaction.commandName
    );

    if (!command) return;

    await command.execute(interaction);

    return;
  };

  const onClientReady = async (client: Client) => {
    // TODO: Register all guilds that the bot exists in

    await registerCommands(discordToken, client.user.id, channelId);

    console.log("Faucet is up");
  };

  client.once("ready", onClientReady);
  client.on("interactionCreate", onInteraction);

  client.login(discordToken);
};

export default DiscordClient;
