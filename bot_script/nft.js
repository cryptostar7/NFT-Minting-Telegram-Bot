const ethers = require('ethers');
const { uploadToIPFS, createMetadata } = require('./metadata');
const FACTORY_ABI = require('./factoryAbi.json');

const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS;
// Connect to Ethereum
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const factory = new ethers.Contract(FACTORY_CONTRACT_ADDRESS, FACTORY_ABI, wallet);

async function handleNFTOperations(userState, photoFileId, ctx) {
    try {
        // Get image file from Telegram
        const file = await ctx.telegram.getFile(photoFileId);
        const imageUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

        // Upload image to IPFS
        const imageHash = await uploadToIPFS(imageUrl, true);

        console.log("Image Hash:", imageHash);

        // Create and upload metadata
        const metadata = createMetadata(
            userState.tokenName,
            userState.tokenSymbol,
            imageHash,
            userState.description
        );

        console.log("Metadata:", metadata);

        const tokenUri = await uploadToIPFS(metadata);

        console.log("Token Uri:", tokenUri);

        
        /**
         * Generate NFT or Mint Existing NFT
         */
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

        let contractAddress = await factory.existAddress(userState.tokenName);
        let tokenId = Number(await factory.idCount(userState.tokenName)) - 1;

        console.log("Contract Address:", typeof contractAddress);
        console.log("Token ID:", typeof tokenId);

        return {
            success: true,
            contractAddress: contractAddress,
            tokenId: tokenId,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

async function getExistingNFTList() {
    const nfts = await factory.getExistingNFTs();
    return nfts
}

module.exports = {
    handleNFTOperations,
    getExistingNFTList
};
