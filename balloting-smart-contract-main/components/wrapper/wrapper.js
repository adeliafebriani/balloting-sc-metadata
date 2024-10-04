'use client';
import { MetaMaskProvider } from '@metamask/sdk-react';

const Provider = ({ children }) => {
	return (
		<MetaMaskProvider
			sdkOptions={{
				dappMetadata: {
					name: 'Example React Dapp',
					url: window.location.href,
				},
				infuraAPIKey: '5f0f1dbc599e4ebd9ee8de493fc6e0cf',
			}}
		>
			{children}
		</MetaMaskProvider>
	);
};

export default Provider;
