import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import CosmosClient from "../client/cosmos";
import { Command } from "../models/discord/command";

const FaucetModule = (cosmosClient: CosmosClient): Command => {
  const config = new SlashCommandBuilder()
    .setName("faucet")
    .setDescription("Receive test token for skynet")
    .addStringOption((option) =>
      option
        .setName("address")
        .setDescription(
          "The like wallet address you would like us to send the test token to"
        )
        .setRequired(true)
    );

  const onCommand = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const address = interaction.options.getString("address", true);
    try {
      const result = await cosmosClient.distribute(address);
      await interaction.editReply(
        `Transaction submitted, txhash: \`${result.tx_response.txhash}\``
      );
    } catch (err) {
      console.error(`Failed to create transaction to ${address} = `, err);
      await interaction.editReply(
        `Failed to create transaction to \`${address}\`, Please try again later`
      );
    }
  };

  return {
    config: config,
    execute: onCommand,
  };
};

export { FaucetModule };
