import type { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    AutocompleteInteraction, 
    ButtonInteraction, 
    ModalSubmitInteraction,
    SharedNameAndDescription
} from "discord.js";

export interface Command {
    data: SlashCommandBuilder | SharedNameAndDescription | any;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
    buttonHandler?: (interaction: ButtonInteraction) => Promise<void>;
    modalHandler?: (interaction: ModalSubmitInteraction) => Promise<void>;
}
