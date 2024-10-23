require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { generateMetadata } = require('./generateMetadata');
const { uploadMetadataToPinata } = require('./uploadMetadata');
const { uploadImageToPinata } = require('./uploadImageToPinata');

const imagesFolder = path.join(__dirname, 'metadata-images');

(async () => {
	const imageFiles = fs.readdirSync(imagesFolder);

	for (const imageFile of imageFiles) {
		const imagePath = path.join(imagesFolder, imageFile);
		const imageName = path.parse(imageFile).name;

		try {
			const result = await uploadImageToPinata(imagePath);
			const imageCID = result.IpfsHash;

			const generateMetaDataPath = generateMetadata(
				imageName,
				`${imageName} description`,
				imageCID,
				'traitTypeExample',
				'valueExample'
			);

			const metadataResult = await uploadMetadataToPinata(generateMetaDataPath);
			const metadataCID = metadataResult.IpfsHash;

			console.log('Metadata IPFS Hash (CID): ', metadataCID);
			console.log('IPFS Hash (CID): ', result.IpfsHash);
			console.log('Token URI: ', `ipfs://${metadataCID}`);
		} catch (error) {
			console.error(`Failed to upload ${imageFile}:`, error);
		}		
	}
})();
