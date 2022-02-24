import CosmosClient from "./client/cosmos";
import DiscordClient from "./client/discord";
import { FaucetModule } from "./commands";

const cosmosClient = CosmosClient();
const discordClient = DiscordClient();

discordClient.registerCommandModule(FaucetModule(cosmosClient));

discordClient.run();
