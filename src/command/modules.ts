import { Command } from "../models/discord/command";
import { FaucetModule } from "./modules/faucet";

export const ModuleList: Command[] = [FaucetModule()];
