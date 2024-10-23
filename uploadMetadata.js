require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadMetadataToPinata(metadataPath) {
	const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

	const formData = new FormData();

	try {
		formData.append('file', fs.createReadStream(metadataPath));
		const response = await axios.post(url, formData, {
			maxBodyLength: 'Infinity',
			headers: {
				'Content-Type': `multipart/form-data; boundary=${formData?._boundary}`,
				pinata_api_key: process.env.PINATA_API_KEY,
				pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
			},
		});

		console.log(`Metadata uploaded to Pinata: ${response.data}`);

		return response.data;
	} catch (error) {
		console.error(`error uploading metadata to Pinata: ${error?.response?.data?.message ?? error?.message}`);
	}
}

module.exports = { uploadMetadataToPinata };
