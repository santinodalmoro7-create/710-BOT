const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // 1. Manejar Comandos de Barra (Slash Commands)
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.run(client, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Error al ejecutar el comando.', ephemeral: true });
            }
        }

        // 2. Manejar el envío del MODAL de Embed
        if (interaction.isModalSubmit() && interaction.customId === 'modalanuncio') {
            const titulo = interaction.fields.getTextInputValue("titulo");
            const desc = interaction.fields.getTextInputValue("desc");
            const thumbnail = interaction.fields.getTextInputValue("thumbnail");
            const banner = interaction.fields.getTextInputValue("banner");
            const corInput = interaction.fields.getTextInputValue("cor") || "#000001";

            // Validar color
            const cor = corInput.startsWith('#') ? corInput : `#${corInput}`;

            const embedanun = new EmbedBuilder()
                .setDescription(desc)
                .setColor(cor)
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
                .setTimestamp();

            if (titulo) embedanun.setTitle(titulo);
            if (banner && banner.startsWith('http')) embedanun.setImage(banner);
            if (thumbnail && thumbnail.startsWith('http')) embedanun.setThumbnail(thumbnail);

            const buttonRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Compra Aqui / Buy Here")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://discord.com/channels/1469618754282586154/1469950823474659409")
            );

            try {
                await interaction.channel.send({ embeds: [embedanun], components: [buttonRow] });
                await interaction.reply({ content: `✅ ¡Embed enviado exitosamente!`, ephemeral: true });
            } catch (error) {
                console.error(error);
                if (!interaction.replied) {
                    await interaction.reply({ content: `❌ Error al enviar: ${error.message}`, ephemeral: true });
                }
            }
        }
    },
};