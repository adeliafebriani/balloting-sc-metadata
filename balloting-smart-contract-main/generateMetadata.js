const fs = require('fs');
const path = require('path');

function generateMetadata(name, description, imageCID, traitType, value) {
	const metadata = {
		name,
		description,
		image: `ipfs://${imageCID}`,
		attributes: [
			{
				trait_Type: traitType,
				value,
			},
		],
	};

	const metadataPath = path.join(__dirname, 'metadata', `${name}.json`);
	fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
	console.log(`Metadata saved to ${metadataPath}`);
	return metadataPath;
}

module.exports = { generateMetadata };