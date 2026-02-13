require('dotenv').config();
const { 
    Client, GatewayIntentBits, Partials, Collection, 
    ActivityType, EmbedBuilder, ActionRowBuilder, 
    ButtonBuilder, ButtonStyle, ModalBuilder, 
    TextInputBuilder, TextInputStyle, PermissionFlagsBits,
    InteractionType, ChannelType
} = require('discord.js');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const speakeasy = require("speakeasy");
const moment = require('moment');
const transcript = require('discord-html-transcripts');

const config = require("./config.json");
const registerCommands = require('./utiles/deploy-commands.js');

// 1. Configuración del Cliente
const client = new Client({ 
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.slashCommands = new Collection();
moment.locale('es');

// 2. Base de Datos
const dbPath = path.join(__dirname, 'tickets.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("❌ Error DB:", err.message);
    db.run(`CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, creatorId TEXT NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP)`);
    db.run(`CREATE TABLE IF NOT EXISTS conteo_tickets (total INT DEFAULT 0)`);
});

let estadoTickets = {};
const rolPermitidoId = "1469967630365622403"; 

// 3. Cargador de Handlers
require('./handler')(client);

// 4. Evento Ready
client.on('ready', async () => {
    console.log(`🔥 Online como ${client.user.username}`);
    // Esto registrará tu comando /compraconfirmada automáticamente
    await registerCommands(); 
    client.user.setActivity("https://discord.gg/hcsFzAG2BQ", { type: ActivityType.Watching });
});

// 5. Manejador Único de Interacciones
client.on("interactionCreate", async (interaction) => {
    try {
        // --- COMANDOS / ---
        if (interaction.type === InteractionType.ApplicationCommand) {
            const cmd = client.slashCommands.get(interaction.commandName);
            if (cmd) await cmd.run(client, interaction);
        }

        // --- BOTONES ---
        if (interaction.isButton()) {
            const { customId } = interaction;

            // Respuestas rápidas
            const respuestas = {
                "copiar_cvu": "0000003100072461415651",
                "copiar_cvu22": "0000003100072461415651",
                "copiar_alias": "710shop",
                "copiar_alias22": "710shop"
            };
            if (respuestas[customId]) return interaction.reply({ content: respuestas[customId], ephemeral: true });

            // 2FA Modal Trigger
            if (customId === "ingresar_clave_2fa") {
                const modal = new ModalBuilder().setCustomId("clave_2fa_modal").setTitle("🔐 Clave Secreta 2FA");
                const input = new TextInputBuilder().setCustomId("clave_2fa_input").setLabel("TOKEN BASE32").setStyle(TextInputStyle.Short).setRequired(true);
                modal.addComponents(new ActionRowBuilder().addComponents(input));
                return await interaction.showModal(modal);
            }

            // Ticket Modals (Abrir formulario)
            if (["opc1", "opc2", "opc3"].includes(customId)) {
                let modalTitle = customId === "opc1" ? "Compras" : customId === "opc2" ? "Soporte" : "Partner";
                const modal = new ModalBuilder().setCustomId(`modal_${customId}`).setTitle(`Formulario - ${modalTitle}`);
                
                // Aquí el bot elige qué preguntas hacer según el botón
                if (customId === "opc1") {
                    modal.addComponents(
                        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("producto").setLabel("Producto").setStyle(TextInputStyle.Short).setRequired(true)),
                        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("metodo_pago").setLabel("Método de Pago").setStyle(TextInputStyle.Short).setRequired(true)),
                        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("cantidad_compra").setLabel("Cantidad").setStyle(TextInputStyle.Short).setRequired(true))
                    );
                } else if (customId === "opc2") {
                    modal.addComponents(
                        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("producto").setLabel("Producto con problemas").setStyle(TextInputStyle.Short).setRequired(true)),
                        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("problema").setLabel("Describe el error").setStyle(TextInputStyle.Paragraph).setRequired(true))
                    );
                } else {
                    modal.addComponents(
                        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("servidor").setLabel("Link Servidor").setStyle(TextInputStyle.Short).setRequired(true)),
                        new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId("miembros").setLabel("¿+100 miembros?").setStyle(TextInputStyle.Short).setRequired(true))
                    );
                }
                return await interaction.showModal(modal);
            }

            // Lógica de Staff (Claim / Close)
            if (customId === "claim_ticket") {
                if (!interaction.member.roles.cache.has(rolPermitidoId)) return interaction.reply({ content: "No eres Staff.", ephemeral: true });
                await interaction.reply({ content: "✅ Ticket reclamado.", ephemeral: true });
                interaction.channel.send({ content: `📌 Asignado a: ${interaction.user}` });
            }
        }

        // --- ENVÍO DE FORMULARIOS (MODALS) ---
        if (interaction.isModalSubmit()) {
            if (interaction.customId === "clave_2fa_modal") {
                const clave = interaction.fields.getTextInputValue("clave_2fa_input");
                const token = speakeasy.totp({ secret: clave, encoding: "base32" });
                return interaction.reply({ content: `✅ Código: \`${token}\``, ephemeral: true });
            }

            // Aquí se crea el CANAL del ticket cuando el usuario termina de llenar el formulario
            if (interaction.customId.startsWith("modal_opc")) {
                const canal = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                        { id: rolPermitidoId, allow: [PermissionFlagsBits.ViewChannel] }
                    ]
                });
                
                estadoTickets[canal.id] = { creadorId: interaction.user.id, fechaCreacion: new Date() };
                await interaction.reply({ content: `✅ Ticket abierto en ${canal}`, ephemeral: true });
                canal.send({ content: `Bienvenido ${interaction.user}, el Staff te atenderá pronto.` });
            }
        }

    } catch (error) {
        console.error("❌ Error:", error);
    }
});

// 6. Login final
client.login(process.env.TOKEN);