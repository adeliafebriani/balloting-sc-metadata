const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('BallotModule', m => {
	const lock = m.contract('Balloting');

	return { lock };
});
