'use client';

import { useAtom } from 'jotai';
import { ballotContract } from '../../store/blockchain';
import styles from './styles.module.scss';

const Homepage = () => {
	const [contract] = useAtom(ballotContract);

	const handleGetMembers = async () => {
		console.log(await contract?.getMembers(), 'list of members');
	};

	return (
		<section className={styles.section}>
			testing the contract
			<button onClick={handleGetMembers}>Get List of Member</button>
		</section>
	);
};

export default Homepage;
