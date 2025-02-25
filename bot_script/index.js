require('dotenv').config();
const { Telegraf } = require('telegraf');
const { handleNFTOperations, getExistingNFTList } = require('./nft');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Store user states
const userStates = {};

bot.command('start', (ctx) => {
    ctx.reply('Welcome to NFT Minting Bot! Choose an option:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Generate New NFT', callback_data: 'generate_nft' }],
                [{ text: 'Mint Existing NFT', callback_data: 'mint_existing' }]
            ]
        }
    });
});

bot.on('callback_query', async (ctx) => {
    const action = ctx.callbackQuery.data;
    const userId = ctx.from.id;

    console.log("User Id:", userId);

    if (action === 'generate_nft') {
        userStates[userId] = { action: 'generate_nft' };
        ctx.reply('Please enter the Token Name:');
    } else if (action === 'mint_existing') {
        // Get existing NFT list
        const existingNFTs = await getExistingNFTList();

        // Create inline keyboard buttons from NFT List
        const nftButtons = existingNFTs.map(nft => [{
            text: nft,
            callback_data: `select_nft:${nft}`
        }])

        ctx.reply('Select an existing NFT to mint:', {
            reply_markup: {
                inline_keyboard: nftButtons
            }
        });
    } else if (action.startsWith('select_nft:')) {
        const selectedNFT = action.split(':')[1];

        console.log("Selected NFT:", selectedNFT);
        userStates[userId] = {
            action: 'mint_existing',
            tokenName: selectedNFT
        };
        ctx.reply('Please enter the description for your NFT:');
    }
});

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const userState = userStates[userId];
    
    if (!userState) return;

    if (userState.action === 'generate_nft') {
        if (!userState.tokenName) {
            userState.tokenName = ctx.message.text;
            ctx.reply('Please enter the Token Symbol:');
        } else if (!userState.tokenSymbol) {
            userState.tokenSymbol = ctx.message.text;
            ctx.reply('Please enter the description for your NFT:');
        } else if (!userState.description) {
            userState.description = ctx.message.text;
            ctx.reply('Please upload the Token Image:');
        }
    } else if (userState.action === 'mint_existing') {
        if (!userState.description) {
            userState.description = ctx.message.text;
            ctx.reply('Please upload the new Token Image:');
        }
    }
});

bot.on('photo', async (ctx) => {
    const userId = ctx.from.id;
    const userState = userStates[userId];

    if (!userState) return;

    try {
        const photo = ctx.message.photo[ctx.message.photo.length - 1];
        const result = await handleNFTOperations(userState, photo.file_id, ctx);
        
        if (result.success) {
            ctx.reply(`Success!\nYour token was minted at ${result.contractAddress} with token ID ${result.tokenId}`);
        } else {
            ctx.reply(`Error: ${result.error}`);
        }

        // Clear user state
        delete userStates[userId];
    } catch (error) {
        ctx.reply(`Error occurred: ${error.message}`);
        delete userStates[userId];
    }
});

bot.telegram.setMyCommands([
    {
        command: 'start',
        description: 'Start the NFT minting process'
    }
]);

bot.launch();
