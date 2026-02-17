require('dotenv').config();
const { REST, Routes, ApplicationCommandType } = require('discord.js');
const fs = require('fs');
const path = require('path');

async function registerCommands() {
    const token = process.env.TOKEN;
    const clientId = process.env.CLIENT_ID;

    if (!token || !clientId) {
        console.error("❌ ERROR: No se encontró el TOKEN o CLIENT_ID en Railway.");
        return;
    }

    const commandsDir = path.join(__dirname, '..', 'Comandos');
    
    if (!fs.existsSync(commandsDir)) {
        console.error(`❌ ERROR: No se encuentra la carpeta: ${commandsDir}`);
        return;
    }

    const commandFolders = fs.readdirSync(commandsDir);
    const allCommands = [];

    console.log(`🔍 Buscando comandos en: ${commandsDir}`);

    for (const folder of commandFolders) {
        const folderPath = path.join(commandsDir, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;

        const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(folderPath, file));
            
            if (command.name && command.description) {
                const data = {
                    name: command.name,
                    description: command.description.slice(0, 100),
                    type: ApplicationCommandType.ChatInput,
                    options: command.options || []
                };

                allCommands.push(data);
                console.log(`✅ Comando detectado: /${command.name}`);
            }
        }
    }

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        if (allCommands.length > 0) {
            console.log(`🌍 Subiendo ${allCommands.length} comandos globales a Discord...`);
            await rest.put(Routes.applicationCommands(clientId), { body: allCommands });
            console.log('✅ ¡PROCESO COMPLETADO CON ÉXITO!');
        }
    } catch (error) {
        console.error('❌ Error al registrar comandos:', error);
    }
}

module.exports = registerCommands;