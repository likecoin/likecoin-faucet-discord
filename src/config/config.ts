import dotenv from "dotenv";
import { ApplicationConfig } from "../models/config";

dotenv.config();

const config: ApplicationConfig = {
  discordToken: process.env.DISCORD_TOKEN,
  channelId: process.env.CHANNEL_ID,
};

export default config;
