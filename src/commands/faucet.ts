import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import CosmosClient from '../client/cosmos';
import { Command } from '../models/discord/command';
import { useRateLimiter } from '../hooks/limiter';
import Config from '../config/config';

const FaucetModule = (cosmosClient: CosmosClient): Command => {
  const rateLimiter = useRateLimiter(Config.faucet.cooldown);

  const config = new SlashCommandBuilder()
    .setName('faucet')
    .setDescription('Receive test token for skynet')
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription(
          'The like wallet address you would like us to send the test token to',
        )
        .setRequired(true),
    );

  const onCommand = async (interaction: CommandInteraction) => {
    await interaction.deferReply();

    if (interaction.channelId !== Config.channelId) {
      await interaction.editReply(
        `:negative_squared_cross_mark: Please use this command in the dedicated channel: <#${Config.channelId}>`,
      );
      return;
    }

    const address = interaction.options.getString('address', true);

    console.debug(`Token request to address ${address}`);

    const rateLimited = rateLimiter.get(address);
    if (rateLimited) {
      await interaction.editReply(
        `:negative_squared_cross_mark: Token already sent to address: \`${address}\`, Please come back again in a day`,
      );
      return;
    }

    try {
      const result = await cosmosClient.distribute(address);
      rateLimiter.limit(address);
      await interaction.editReply(
        `:white_check_mark: Transaction submitted, txhash: \`${result.tx_response.txhash}\``,
      );
    } catch (err: unknown) {
      console.error(`Failed to create transaction to ${address} = `, err);
      await interaction.editReply(
        `:warning: Failed to create transaction to \`${address}\`, Please try again later`,
      );
    }
  };

  return {
    config: config,
    execute: onCommand,
  };
};

export { FaucetModule };
