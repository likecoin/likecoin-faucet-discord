import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../../models/discord/command";

const FaucetModule = (): Command => {
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
    await new Promise((r) => setTimeout(r, 500));
    await interaction.editReply("HelloWorld");
  };

  return {
    config: config,
    execute: onCommand,
  };
};

export { FaucetModule };
