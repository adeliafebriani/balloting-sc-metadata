'use client';

import { useSDK } from '@metamask/sdk-react';
import { useAtom } from 'jotai';
import { Contract, Wallet } from 'ethers';
import { useEffect, useRef } from 'react';
import { connectWallet, getContract } from '@/util/contracs';

import { connectedAccount, ballotContract } from '@/store/blockchain';
import BallotContract from '../../artifacts/contracts/Ballot.sol/Balloting.json';

const contractAddress = '0x46fD84b50D815e976FEFc03C966C37B84F378958';
const contractAbi = BallotContract['abi'];

import styles from './header.module.scss';

const Hearder = () => {
	const [account, setAccount] = useAtom(connectedAccount);
	const [, setBallotContract] = useAtom(ballotContract);
	const providerRef = useRef(null);

	// useEffect(() => {
	// 	(async () => {
	// 		const { provider, signer } = await connectWallet();
	// 		const contract = getContract(signer);

	// 		const memberList = contract?.getMembers();
	// 		console.log(memberList);
	// 	})();
	// }, []);
	// const { sdk, provider } = useSDK();

	// const handleConnection = async () => {
	// 	try {
	// 		const accounts = await sdk.connect();
	// 		const account = accounts?.length > 0 ? accounts[0] : '';

	// 		console.log(sdk);

	// 		if (!account) return;
	// 		const wallet = new Wallet(account);
	// 		const contract = new Contract(contractAddress, contractAbi, wallet);

	// 		setAccount(account);
	// 		setBallotContract(contract);
	// 	} catch (error) {
	// 		alert(error?.message);
	// 	}
	// };

	// provider?.on('accountsChanged', accounts => {
	// 	const account = accounts?.length > 0 ? accounts[0] : '';
	// 	if (!account) return;
	// 	setAccount(account);
	// });

	const handleConnection = async () => {
		try {
			const { provider, signer } = await connectWallet();

			const contract = getContract(signer);
			const listMembers = await contract.getMembers();
			console.log(listMembers?.target, 'this is memberlist');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<header className={styles.header}>
			{account && <p>Connected Account: {account}</p>}
			<button className={styles.button} onClick={handleConnection}>
				Connect Wallet
			</button>
		</header>
	);
};

export default Hearder;
