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
    .setDescription(`Receive ${Config.faucet.amount / 1000000000} LIKE on ${Config.faucet.chainId}`)
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription(
          'The like wallet address you would like us to send the LIKE to',
        )
        .setRequired(true),
    );

  const onCommand = async (interaction: CommandInteraction) => {
    const address = interaction.options.getString('address', true);
    console.debug(`Token request to address ${address}`);
    try {
      await interaction.deferReply();

      if (interaction.channelId !== Config.channelId) {
        await interaction.editReply(
          `:negative_squared_cross_mark: Please use this command in the dedicated channel: <#${Config.channelId}>`,
        );
        return;
      }

      const discordId = interaction.user.id;
      const [drop, created] = await sequelize.transaction(
        {
          isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        },
        async (t) => {
          const pastDrop = await Drop.findOne({
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
          });

          if (pastDrop) {
            return [pastDrop, false];
          }

          const newDrop = await Drop.create({
            username: interaction.user.username,
            discordId: discordId,
            address: address,
            amount: Config.faucet.amount,
            txHash: 'pending',
          },
            { transaction: t },
          );
          return [newDrop, true];
        }
      )

      if (!created) {
        const txHash = drop.get('txHash');
        await interaction.editReply(`:negative_squared_cross_mark: Each user can only claim once, your past txhash: [${txHash}](${Config.faucet.chainViewerUrl}/${txHash}).`);
        return;
      }

      try {
        const txHash = await cosmosClient.distribute(address);
        await drop.update({ txHash: txHash });
        await interaction.editReply(`:white_check_mark: Transaction submitted, txhash: [${txHash}](${Config.faucet.chainViewerUrl}/${txHash})`);
      } catch (err: unknown) {
        await drop.destroy();
        throw err;
      }
    } catch (err: unknown) {
      console.error(`Failed to create transaction to ${address} = `, err);
      await interaction.editReply(`:warning: Failed to create transaction to \`${address}\`, please try again later`);
    }
  };

  return {
    config: config,
    execute: onCommand,
  };
};

export { FaucetModule };
