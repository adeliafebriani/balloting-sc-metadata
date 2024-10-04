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

	describe('Nomination', function () {
		beforeEach(async function () {
			// Register three members
			await balloting.registerMember(member1.address);
			await balloting.registerMember(member2.address);
			await balloting.registerMember(member3.address);
		});
	
		it('Registered members can nominate others', async function () {
			await balloting.connect(member1).nominateMember(member2.address);
			const nominees = await balloting.getNominees();
			expect(nominees).to.include(member2.address);
		});
	
		it('Cannot nominate oneself', async function () {
			await expect(balloting.connect(member1).nominateMember(member1.address)).to.be.revertedWith(
				'You cannot nominate yourself'
			);
		});
	
		it('Cannot nominate a non-registered member', async function () {
			const [_, nonRegisteredMember] = await ethers.getSigners();
			await expect(balloting.connect(member1).nominateMember(nonRegisteredMember.address)).to.be.revertedWith(
				'Nominee must be a registered member'
			);
		});
	
		it('Cannot nominate the same member twice', async function () {
			await balloting.connect(member1).nominateMember(member2.address);
			await expect(balloting.connect(member1).nominateMember(member2.address)).to.be.revertedWith(
				'Nominee is already nominated'
			);
		});
	});	

	// Write test for voting

	describe('Voting', function () {
		beforeEach(async function () {
			// Register three members
			await balloting.registerMember(member1.address);
			await balloting.registerMember(member2.address);
			await balloting.registerMember(member3.address);
	
			// Nominate two members
			await balloting.connect(member1).nominateMember(member2.address);
			await balloting.connect(member3).nominateMember(member1.address);
	
			// Start voting
			await balloting.startVoting();
		});
	
		it('Admin can start voting', async function () {
			expect(await balloting.votingActive()).to.be.true;
		});
	
		it('Registered members can vote for nominees when voting is active', async function () {
			await balloting.connect(member1).vote(member2.address);
			const votes = await balloting.votes(member2.address);
			expect(votes).to.equal(1);
		});
	
		it('Cannot vote if voting is not active', async function () {
			await balloting.endVoting();
			await expect(balloting.connect(member1).vote(member2.address)).to.be.revertedWith('Voting is not active');
		});
	
		it('Cannot vote more than once', async function () {
			await balloting.connect(member1).vote(member2.address);
			await expect(balloting.connect(member1).vote(member2.address)).to.be.revertedWith('You have already voted');
		});
	
		it('Cannot vote for a non-nominated member', async function () {
			await expect(balloting.connect(member1).vote(member3.address)).to.be.revertedWith(
				'You can only vote for nominated members'
			);
		});
	});

	// Ending voting and winner selection

	describe('Ending Voting and Winner Selection', function () {
		beforeEach(async function () {
			// Register and nominate members
			await balloting.registerMember(member1.address);
			await balloting.registerMember(member2.address);
			await balloting.registerMember(member3.address);
			await balloting.connect(member1).nominateMember(member2.address);
			await balloting.connect(member2).nominateMember(member1.address);
	
			// Start voting
			await balloting.startVoting();
		});
	
		it('Admin can end the voting and declare the winner', async function () {
			// Vote
			await balloting.connect(member1).vote(member2.address);
			await balloting.connect(member2).vote(member1.address);
			await balloting.connect(member3).vote(member2.address);
	
			// End voting
			await balloting.endVoting();
			
			const winner = await balloting.winner();
			expect(winner).to.equal(member2.address);
		});
	
		it('Should select the nominee with the highest votes as the winner', async function () {
			await balloting.connect(member1).vote(member2.address);
			await balloting.connect(member3).vote(member2.address);
	
			await balloting.endVoting();
			const winner = await balloting.winner();
			expect(winner).to.equal(member2.address);
		});
	});
});
