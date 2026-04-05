// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AgentBondLite {
    enum TaskStatus {
        Open,
        Claimed,
        Submitted,
        Accepted,
        Rejected,
        Cancelled
    }

    struct Task {
        address payable client;
        address payable agent;
        uint128 reward;
        uint128 stakeRequired;
        uint64 createdAt;
        uint64 claimedAt;
        uint64 resolvedAt;
        TaskStatus status;
        string title;
        string brief;
        string submissionURI;
        bytes32 submissionHash;
    }

    struct AgentProfile {
        uint128 activeStake;
        uint64 acceptedCount;
        uint64 rejectedCount;
        uint128 rewardsEarned;
    }

    error InvalidTask();
    error InvalidStatus();
    error Unauthorized();
    error InvalidAmount();
    error EmptyText();

    uint256 public nextTaskId = 1;
    address public immutable treasury;

    mapping(uint256 => Task) private tasks;
    mapping(address => AgentProfile) public agentProfiles;

    event TaskCreated(
        uint256 indexed taskId,
        address indexed client,
        uint256 reward,
        uint256 stakeRequired,
        string title
    );
    event TaskClaimed(uint256 indexed taskId, address indexed agent, uint256 stakeLocked);
    event TaskSubmitted(uint256 indexed taskId, address indexed agent, string submissionURI, bytes32 submissionHash);
    event TaskAccepted(uint256 indexed taskId, address indexed client, address indexed agent, uint256 payout);
    event TaskRejected(
        uint256 indexed taskId,
        address indexed client,
        address indexed agent,
        uint256 rewardRefund,
        uint256 stakeSlashed
    );
    event TaskCancelled(uint256 indexed taskId, address indexed client, uint256 rewardRefund);

    constructor(address treasuryAddress) {
        treasury = treasuryAddress == address(0) ? msg.sender : treasuryAddress;
    }

    function createTask(
        string calldata title,
        string calldata brief,
        uint128 stakeRequired
    ) external payable returns (uint256 taskId) {
        if (bytes(title).length == 0 || bytes(brief).length == 0) revert EmptyText();
        if (msg.value == 0) revert InvalidAmount();

        taskId = nextTaskId++;
        tasks[taskId] = Task({
            client: payable(msg.sender),
            agent: payable(address(0)),
            reward: uint128(msg.value),
            stakeRequired: stakeRequired,
            createdAt: uint64(block.timestamp),
            claimedAt: 0,
            resolvedAt: 0,
            status: TaskStatus.Open,
            title: title,
            brief: brief,
            submissionURI: "",
            submissionHash: bytes32(0)
        });

        emit TaskCreated(taskId, msg.sender, msg.value, stakeRequired, title);
    }

    function claimTask(uint256 taskId) external payable {
        Task storage task = tasks[taskId];
        if (task.client == address(0)) revert InvalidTask();
        if (task.status != TaskStatus.Open) revert InvalidStatus();
        if (msg.value != task.stakeRequired) revert InvalidAmount();

        task.agent = payable(msg.sender);
        task.claimedAt = uint64(block.timestamp);
        task.status = TaskStatus.Claimed;

        agentProfiles[msg.sender].activeStake += uint128(msg.value);

        emit TaskClaimed(taskId, msg.sender, msg.value);
    }

    function submitTask(uint256 taskId, string calldata submissionURI, bytes32 submissionHash) external {
        Task storage task = tasks[taskId];
        if (task.client == address(0)) revert InvalidTask();
        if (task.status != TaskStatus.Claimed) revert InvalidStatus();
        if (task.agent != msg.sender) revert Unauthorized();
        if (bytes(submissionURI).length == 0 || submissionHash == bytes32(0)) revert InvalidAmount();

        task.submissionURI = submissionURI;
        task.submissionHash = submissionHash;
        task.status = TaskStatus.Submitted;

        emit TaskSubmitted(taskId, msg.sender, submissionURI, submissionHash);
    }

    function acceptTask(uint256 taskId) external {
        Task storage task = tasks[taskId];
        if (task.client == address(0)) revert InvalidTask();
        if (task.status != TaskStatus.Submitted) revert InvalidStatus();
        if (task.client != msg.sender) revert Unauthorized();

        task.status = TaskStatus.Accepted;
        task.resolvedAt = uint64(block.timestamp);

        AgentProfile storage profile = agentProfiles[task.agent];
        profile.activeStake -= task.stakeRequired;
        profile.acceptedCount += 1;
        profile.rewardsEarned += task.reward;

        uint256 payout = uint256(task.reward) + uint256(task.stakeRequired);
        (bool sent, ) = task.agent.call{value: payout}("");
        require(sent, "PAYOUT_FAILED");

        emit TaskAccepted(taskId, msg.sender, task.agent, payout);
    }

    function rejectTask(uint256 taskId) external {
        Task storage task = tasks[taskId];
        if (task.client == address(0)) revert InvalidTask();
        if (task.status != TaskStatus.Submitted) revert InvalidStatus();
        if (task.client != msg.sender) revert Unauthorized();

        task.status = TaskStatus.Rejected;
        task.resolvedAt = uint64(block.timestamp);

        AgentProfile storage profile = agentProfiles[task.agent];
        profile.activeStake -= task.stakeRequired;
        profile.rejectedCount += 1;

        uint256 rewardRefund = uint256(task.reward);
        uint256 slashedStake = uint256(task.stakeRequired);

        (bool refundSent, ) = task.client.call{value: rewardRefund}("");
        require(refundSent, "REFUND_FAILED");

        if (slashedStake > 0) {
            (bool stakeSent, ) = payable(treasury).call{value: slashedStake}("");
            require(stakeSent, "SLASH_FAILED");
        }

        emit TaskRejected(taskId, msg.sender, task.agent, rewardRefund, slashedStake);
    }

    function cancelOpenTask(uint256 taskId) external {
        Task storage task = tasks[taskId];
        if (task.client == address(0)) revert InvalidTask();
        if (task.status != TaskStatus.Open) revert InvalidStatus();
        if (task.client != msg.sender) revert Unauthorized();

        task.status = TaskStatus.Cancelled;
        task.resolvedAt = uint64(block.timestamp);

        uint256 rewardRefund = uint256(task.reward);
        (bool sent, ) = task.client.call{value: rewardRefund}("");
        require(sent, "CANCEL_REFUND_FAILED");

        emit TaskCancelled(taskId, msg.sender, rewardRefund);
    }

    function getTask(uint256 taskId) external view returns (Task memory) {
        Task memory task = tasks[taskId];
        if (task.client == address(0)) revert InvalidTask();
        return task;
    }

    function getTasks(uint256 fromTaskId, uint256 limit) external view returns (Task[] memory items) {
        if (fromTaskId == 0) {
            fromTaskId = 1;
        }
        if (limit == 0) {
            limit = 10;
        }

        uint256 upperBound = fromTaskId + limit;
        if (upperBound > nextTaskId) {
            upperBound = nextTaskId;
        }

        uint256 count = upperBound > fromTaskId ? upperBound - fromTaskId : 0;
        items = new Task[](count);
        uint256 index = 0;

        for (uint256 taskId = fromTaskId; taskId < upperBound; taskId++) {
            items[index] = tasks[taskId];
            index++;
        }
    }
}
