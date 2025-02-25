const ethers = require('ethers');
const { uploadToIPFS, createMetadata } = require('./metadata');
const FACTORY_ABI = require('./factoryAbi.json');

const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS;

async function handleNFTOperations(userState, photoFileId, ctx) {
    try {
        // Get image file from Telegram
        const file = await ctx.telegram.getFile(photoFileId);
        const imageUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

        // Upload image to IPFS
        const imageHash = await uploadToIPFS(imageUrl, true);

        // Create and upload metadata
        const metadata = createMetadata(
            userState.tokenName,
            userState.tokenSymbol,
            imageHash,
            userState.description
        );
        const tokenUri = await uploadToIPFS(metadata);

        // Connect to Ethereum
        console.log("RPC URL:", process.env.SEPOLIA_RPC_URL);
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const factory = new ethers.Contract(FACTORY_CONTRACT_ADDRESS, FACTORY_ABI, wallet);

        let transaction;
        if (userState.action === 'generate_nft') {
            transaction = await factory.createNewNFT(
                userState.tokenName,
                userState.tokenSymbol,
                tokenUri
            );
        } else {
            transaction = await factory.existingNFTMint(
                userState.tokenName,
                tokenUri
            );
        }

        await transaction.wait();

        return {
            success: true,
            transaction: transaction.hash
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    handleNFTOperations
};
