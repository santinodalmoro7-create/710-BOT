const Discord = require("discord.js")

const config = require('../../config.json')

module.exports = {
  name: "panelmiembros", // Coloque o nome do comando
  description: "📦 | Entregar Panel Miembros", // Coloque a descrição do comando
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

                // ID del rol requerido
                const requiredRoleId = `${config.eventas}`;"1469967630365622403"

                // Verificar si el usuario tiene el rol
        const member = interaction.member;
        const hasRole = member.roles.cache.has(requiredRoleId);"1469967630365622403"
    
        if (!hasRole) {
          return interaction.reply({ content: " | No tienes permiso para usar este comando.", ephemeral: true });
        }

    let bot = client.user.username;
    let avatar_bot = client.user.displayAvatarURL({ dynamic: true });

    let embed = new Discord.EmbedBuilder()
      .setTitle("¡Gracias por tu compra! 🎉")
      .setColor(config.colorpredeterminado)
      .setTimestamp()
      .setThumbnail("https://cdn.discordapp.com/attachments/1468886283353853987/1470915343932461116/ChatGPT_Image_10_feb_2026_19_53_00.png?ex=698d082a&is=698bb6aa&hm=8a8a80b76be8e94dd95439c803d1a278eb660d1197a4cfb4c6f87408ebe943b0&")
      .setFooter({ text: bot, iconURL: avatar_bot })
      .setDescription(
        `**•  __Producto__:** Panel Miembros\n\n` +
        `**•  Link:** ||https://members-hub.store/||\n\n` +
        `Déjanos por favor una buena reseña para poder seguir creciendo! `
      );

    // 1. Enviar mensaje ephemeral al usuario
    await interaction.reply({
      content: "✅ Producto entregado exitosamente.",
      ephemeral: true
    });

    // 2. Enviar embed públicamente al canal
    await interaction.channel.send({ embeds: [embed] });"https://discord.com/channels/1469618754282586154/1469619944676135033"
  }
}