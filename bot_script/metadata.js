// const { Web3Storage } = require('web3.storage');
// const axios = require('axios');

// const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });

// async function uploadToIPFS(content) {
//     if (typeof content === 'string' && content.startsWith('http')) {
//         const response = await axios.get(content, { responseType: 'arraybuffer' });
//         content = response.data;
//     }

//     const files = [
//         new File([content], 'content', {
//             type: typeof content === 'string' ? 'application/json' : 'image/png'
//         })
//     ];

//     const cid = await client.put(files);
//     return `ipfs://${cid}`;
// }

// function createMetadata(name, symbol, imageHash) {
//     return JSON.stringify({
//         name,
//         symbol,
//         image: imageHash,
//         description: `NFT created via Telegram Bot`
//     });
// }

// module.exports = {
//     uploadToIPFS,
//     createMetadata
// };

const axios = require('axios');
const FormData = require('form-data');

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;

async function uploadToIPFS(content, isImage = false) {
    const formData = new FormData();
    
    if (isImage) {
        const response = await axios.get(content, { responseType: 'arraybuffer' });
        formData.append('file', response.data, { filename: 'image.png' });
    } else {
        formData.append('file', Buffer.from(content), { filename: 'metadata.json' });
    }

    const result = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataApiSecret
        }
    });

    return `ipfs://${result.data.IpfsHash}`;
}

function createMetadata(name, symbol, imageHash, description) {
    return JSON.stringify({
        name,
        symbol,
        image: imageHash,
        description: description
    });
}

module.exports = {
    uploadToIPFS,
    createMetadata
};
