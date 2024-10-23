require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: '0.8.24',
	networks: {
		hardhat: {},
		sepolia: {
			url: 'https://sepolia.infura.io/v3/7c4f1e66efd24d9d816c22a3c78cc36e',
			accounts: ['75b982f85271dcedf8eb81a4cc40df4ee1312eed98d09921d7c04e694fac1f6c'],
			chainId: 11155111,
		},
	},
};
