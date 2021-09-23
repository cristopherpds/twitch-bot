import { Client } from 'tmi.js';
import "dotenv/config.js"
import dbConnect from './dbConnect.js';
import Commands from './src/models/commands.js';
//require('dotenv').config()

const client = new Client({
	options: { debug: true, messagesLogLevel: "info" },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_TOKEN,
	},
	channels: process.env.CHANNELS.split(',').map(chan => chan.trim()).filter(v => v.length > 0),
});

client.connect().catch(console.error);

client.on('chat', async (target, ctx, message, self) => {
	if (self) return;

	//console.log(`${target}/${ctx['display-name']}: ${message}`);

	const args = message.split(' ');
	const command = args.shift();

	if (command.startsWith('!')) {
		switch (command) {
			case '!comando':
				const trigger = args.shift();
				const commandName = args.shift()
				const commandResp = args.join(' ');
				switch (trigger) {
					case 'add':
						await dbConnect();
						const add = new Commands({
							name: commandName.startsWith('!') ? commandName : `!${commandName}`,
							response: commandResp
						});
						add.save((err) => {
							if (err) return client.say(channel, 'Ocorreu um erro');
							return client.say(channel, `${commandName} foi adicionado com sucesso!`);
						});
						break;

					case 'edit':
						await dbConnect();
						const edit = Commands.findOne({ name: commandName.startsWith('!') ? commandName : `!${commandName}` });
						if (!edit) return client.say(channel, 'Comando nao encontrado');
						edit.response = commandResp
						edit.save((err) => {
							if (err) return client.say(channel, 'Ocorreu um erro');
							return client.say(channel, `${commandName} foi actualizado com sucesso!`);
						});
						break;
					case 'del':
						await dbConnect();
						const del = Commands.deleteOne({ name: commandName.startsWith('!') ? commandName : `!${commandName}` });
						if (!del.n) return client.say(channel, 'Comando nao encontrado');
						if (!del.ok) return client.say(channel, 'Ocorreu um erro');
						client.say(channel, `${commandName} foi removido com sucesso!`);
						break;
					default:
						break;
				}
				break;
			default:
				await dbConnect()
				const cmd = await Commands.findOne({ name: command });
				if (!cmd) return
				client.say(channel, cmd.response)
				break;
		}
	}
});

/*setInterval(() => {
	client.say('#josue1342yt', 'kkkk');
}, 10 * 60 * 1000);*/

//https://api-charada.herokuapp.com/puzzle?lang=ptbr
