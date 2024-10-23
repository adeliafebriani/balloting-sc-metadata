const fs = require('fs');
const path = require('path');

const metadataFilePath = path.join(__dirname, 'metadata', 'metadata.json');

function loadMetadata() {
    try {
        if (fs.existsSync(metadataFilePath)) {
            const data = fs.readFileSync(metadataFilePath);
            return JSON.parse(data);  
        } else {
            return []; 
        }
    } catch (error) {
        console.error('Error reading metadata file:', error);
        return []; 
    }
}

function saveMetadata(metadataArray) {
    try {
        fs.writeFileSync(metadataFilePath, JSON.stringify(metadataArray, null, 2));
        console.log(`Metadata saved to ${metadataFilePath}`);
    } catch (error) {
        console.error('Error writing to metadata file:', error);
    }
}

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

    const metadataArray = loadMetadata();  
    const isDuplicate = metadataArray.some(meta => meta.name === name);
	
    if (isDuplicate) {
        console.log(`Metadata with name "${name}" already exists. Skipping addition.`);
        return metadataFilePath;
    }

	metadataArray.push(metadata); 
    saveMetadata(metadataArray);  

    return metadataFilePath;  
}

module.exports = { generateMetadata };
