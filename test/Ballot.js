const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Balloting Contract', function () {
	let Balloting, balloting, admin, member1, member2, member3;

	beforeEach(async function () {
		[admin, member1, member2, member3] = await ethers.getSigners();

		Balloting = await ethers.getContractFactory('Balloting');
		balloting = await Balloting.deploy();
		await balloting.waitForDeployment();
	});

	describe('Deployment', function () {
		it('should set the right admin', async function () {
			expect(await balloting.admin()).to.equal(admin.address);
		});

		it('should initialize with no members and no nominee', async function () {
			expect(await balloting.getMembers()).to.have.lengthOf(0);
			expect(await balloting.getNominees()).to.have.lengthOf(0);
		});
	});

	describe('Member Registration', function () {
		it('Admin can register a new member', async function () {
			await balloting.registerMember(member1.address);
			const members = await balloting.getMembers();
			expect(members).to.include(member1.address);
			const memberData = await balloting.members(member1.address);
			expect(memberData.registered).to.be.true;
		});

		it('Non-admin cannot register a member', async function () {
			await expect(balloting.connect(member1).registerMember(member2.address)).to.be.revertedWith(
				'Only the admin can perform this action'
			);
		});

		it('Cannot register the same account twice', async function () {
			await balloting.registerMember(member1.address);
			await expect(balloting.registerMember(member1.address)).to.be.revertedWith('Member is already registered');
		});
	});

	//  Write test for Nomination

	// Registered members can nominate others
	// Cannot nominate oneself
	// cannot nominate a non registered member
	// cannot nominate the same member twice

	// Write test for voting

	// admin can start a voting
	//Registered members can vote for nominees when voting is active
	//Cannot vote if voting is not active
	// Cannot vote more than once
	// Cannot vote for a non nominated member

	// Ending voting and winner selection

	// admin can end the voting and declare the winner
});
