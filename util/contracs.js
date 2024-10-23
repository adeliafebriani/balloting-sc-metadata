import { ethers } from 'ethers';
import contract from '../artifacts/contracts/Ballot.sol/Balloting.json';
const abi = contract['abi'];
const contractAddress = '0x46fD84b50D815e976FEFc03C966C37B84F378958';

export const connectWallet = async () => {
	let provider = null;
	let signer = null;
	let account = '';

	if (window?.ethereum === null) {
		provider = ethers.getDefaultProvider();

		signer = await provider.getSigner();
	} else {
		provider = new ethers.BrowserProvider(window.ethereum);
		const accounts = await provider.send('eth_requestAccounts');
		account = accounts?.length > 0 ? accounts[0] : '';
		signer = await provider.getSigner();
	}

	return { provider, signer, account };
};

export const getContract = signer => {
	return new ethers.Contract(contractAddress, abi, signer);
};
