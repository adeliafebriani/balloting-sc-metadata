// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Balloting Smart Contract
 * @notice This contract allows members to nominate, vote, and decide a winner
 * @dev A balloting system where members can nominate and vote for nominees
 */
contract Balloting {
    
    struct Member {
        bool registered;
        bool voted;
        bool nominated;
    }
    
    address public admin;
    mapping(address => Member) public members;
    address[] public nominees;
    address[] public memberList;
    mapping(address => uint) public votes;
    address public winner;
    bool public votingActive;
        
    /**
     * @dev Sets the admin as the only one who can deploy the contract and initializes election status
     */    
    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can perform this action");
        _;
    }

    modifier onlyRegistered() {
        require(members[msg.sender].registered, "Only registered members can perform this action");
        _;
    }

    modifier whenVotingActive() {
        require(votingActive, "Voting is not active");
        _;
    }    

    /**
     * @notice Registers a new member
     * @dev Call by the admin only
     * @param _member The address of the member to be registered
     */
    function registerMember(address _member) external onlyAdmin {
        require(!members[_member].registered, "Member is already registered");
        members[_member] = Member(true, false, false);
        memberList.push(_member);
    }

    /**
     * @notice Nominates a member for the election
     * @dev Call by registered members only
     * @param _nominee The address of the member to be nominated
     */
    function nominateMember(address _nominee) external onlyRegistered {
        require(_nominee != msg.sender, "You cannot nominate yourself");
        require(members[_nominee].registered, "Nominee must be a registered member");
        require(!members[_nominee].nominated, "Nominee is already nominated");
        
        members[_nominee].nominated = true;
        nominees.push(_nominee);
    }

    /** 
     * @notice Starts the voting process
     * @dev Call by admin only
     */
    function startVoting() external onlyAdmin {
        votingActive = true;
    }

    /**
     * @notice Casts a vote for a nominated member
     * @dev Call by registered members only while voting is active
     * @param _nominee Address of the nominated member to vote for the election
     */
    function vote(address _nominee) external onlyRegistered whenVotingActive {
        require(!members[msg.sender].voted, "You have already voted");
        require(members[_nominee].nominated, "You can only vote for nominated members");
        
        members[msg.sender].voted = true;
        votes[_nominee]++;
    }

    /** 
     * @notice Ends the voting process and calculates the winner
     * @dev Call by admin only
     */
    function endVoting() external onlyAdmin {
        votingActive = false;
        uint highestVotes = 0;
        
        for (uint i = 0; i < nominees.length; i++) {
            if (votes[nominees[i]] > highestVotes) {
                highestVotes = votes[nominees[i]];
                winner = nominees[i];
            }
        }
    }

    /** 
     * @notice Ends the voting process and calculates the winner
     * @dev Call by admin only
     */
    function resetElection() external onlyAdmin {
        for (uint i = 0; i < nominees.length; i++) {
            address nominee = nominees[i];
            members[nominee].nominated = false;
            votes[nominee] = 0;
        }

        winner = address(0);

        for (uint i = 0; i < memberList.length; i++) {
            address member = memberList[i];
            members[member].registered = false;
            members[member].voted = false;
            members[member].nominated = false;        
        }

        delete nominees;
        delete memberList;
    }

    /** 
     * @notice Returns the list of registered members
     * @return The list of registered members
     */
    function getMembers() external view returns (address[] memory) {
        return memberList;
    }

    /** 
     * @notice Returns the list of nominees
     * @return The list of nominees
     */
    function getNominees() external view returns (address[] memory) {
        return nominees;
    }

    /** 
     * @notice Checks if a member is nominated
     * @param _member Address of the member to check
     * @return True if the member is nominated, otherwise false
     */
    function isNominated(address _member) external view returns (bool) {
        return members[_member].nominated;
    }
}