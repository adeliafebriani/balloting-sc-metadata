require('dotenv').config();
const path = require('path');
const { generateMetadata } = require('./generateMetadata');
const { uploadMetadataToPinata } = require('./uploadMetadata');
const { uploadImageToPinata } = require('./uploadImageToPinata');

(async () => {

	const imagePath = path.join(__dirname, 'Ronaldo.jpg');
	const result = await uploadImageToPinata(imagePath);
	const imageCID = result.IpfsHash;

	const generateMetaDataPath = generateMetadata(
		'Ronaldo NFT',
		'Ronaldo Champions league goal',
		imageCID,
		'ash',
		'adding a soothing calm'
	);

	const metadataResult = await uploadMetadataToPinata(generateMetaDataPath);
	const metadataCID = metadataResult.IpfsHash;

	console.log('Metadata IPFS Hash (CID): ', metadataCID);
	console.log('IPFS Hash (CID): ', result.IpfsHash);
	console.log('Token URI: ', `ipfs://${metadataCID}`);
})();