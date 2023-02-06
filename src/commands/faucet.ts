import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Transaction, Op } from 'sequelize';

import CosmosClient from '../client/cosmos';
import { Command } from '../models/discord/command';
import { sequelize, Drop, initDB } from '../hooks/db';
import Config from '../config/config';

const FaucetModule = (cosmosClient: CosmosClient): Command => {
  // eslint-disable-next-line no-void
  void initDB();

  const config = new SlashCommandBuilder()
    .setName('faucet')
    .setDescription(`Receive test token for ${Config.env}`)
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

    const discordId = interaction.user.id;
    const address = interaction.options.getString('address', true);

    console.debug(`Token request to address ${address}`);
    const [drop, created] = await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
      },
      async (t) => {
        const result = await Drop.findOrCreate({
          transaction: t,
          where: {
            createdAt: {
              [Op.gt]: new Date(Date.now() - Config.faucet.cooldownInDay * 24 * 60 * 60 * 1000),
            },
            [Op.or]: [
              { discordId: discordId },
              { address: address },
            ],
          },
          defaults: {
            username: interaction.user.username,
            discordId: discordId,
            address: address,
            amount: Config.faucet.amount,
            txHash: 'pending',
            createdAt: new Date(),
          },
        });
        return result;
      }
    );

    if (!created) {
      const txHash = drop.get('txHash');
      await interaction.editReply(`:negative_squared_cross_mark: Each user can only claim once, your previous txhash: [${txHash}](${Config.faucet.restUrl}/cosmos/tx/v1beta1/txs/${txHash}).`);
      return;
    }

    try {
      const txHash = await cosmosClient.distribute(address);
      await drop.update({ txHash: txHash });
      await interaction.editReply(`:white_check_mark: Transaction submitted, txhash: [${txHash}](${Config.faucet.restUrl}/cosmos/tx/v1beta1/txs/${txHash})`);
    } catch (err: unknown) {
      console.error(`Failed to create transaction to ${address} = `, err);
      await drop.destroy();
      await interaction.editReply(`:warning: Failed to create transaction to \`${address}\`, please try again later`);
    }
  };

  return {
    config: config,
    execute: onCommand,
  };
};

export { FaucetModule };
