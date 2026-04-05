// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IReportRegistry {
    function requesterOf(uint256 reportId) external view returns (address);
    function operatorOf(uint256 reportId) external view returns (address);
}

contract SettlementEscrow {
    enum SettlementStatus {
        None,
        Funded,
        Accepted,
        Disputed,
        Refunded
    }

    struct Settlement {
        uint256 reportId;
        address requester;
        address operator;
        uint128 amount;
        uint64 fundedAt;
        uint64 resolveAfter;
        SettlementStatus status;
        string disputeReasonURI;
    }

    struct OperatorStats {
        uint64 acceptedReports;
        uint64 disputedReports;
        uint128 totalEarned;
    }

    error InvalidAmount();
    error InvalidReport();
    error InvalidStatus();
    error Unauthorized();
    error InvalidTimeout();
    error EmptyReason();

    uint64 public constant MIN_TIMEOUT = 5 minutes;
    IReportRegistry public immutable reportRegistry;

    mapping(uint256 => Settlement) private settlements;
    mapping(address => OperatorStats) public operatorStats;

    event SettlementFunded(
        uint256 indexed reportId,
        address indexed requester,
        address indexed operator,
        uint256 amount,
        uint64 resolveAfter
    );
    event SettlementAccepted(uint256 indexed reportId, address indexed requester, address indexed operator);
    event SettlementDisputed(uint256 indexed reportId, address indexed requester, string reasonURI);
    event SettlementRefunded(uint256 indexed reportId, address indexed requester, uint256 amount);

    constructor(address reportRegistryAddress) {
        reportRegistry = IReportRegistry(reportRegistryAddress);
    }

    function fundSettlement(uint256 reportId, uint64 timeoutSeconds) external payable {
        if (msg.value == 0) revert InvalidAmount();
        if (timeoutSeconds < MIN_TIMEOUT) revert InvalidTimeout();

        Settlement storage existing = settlements[reportId];
        if (existing.status != SettlementStatus.None) revert InvalidStatus();

        address requester = reportRegistry.requesterOf(reportId);
        address operator = reportRegistry.operatorOf(reportId);

        if (requester == address(0) || operator == address(0)) revert InvalidReport();
        if (msg.sender != requester) revert Unauthorized();

        settlements[reportId] = Settlement({
            reportId: reportId,
            requester: requester,
            operator: operator,
            amount: uint128(msg.value),
            fundedAt: uint64(block.timestamp),
            resolveAfter: uint64(block.timestamp + timeoutSeconds),
            status: SettlementStatus.Funded,
            disputeReasonURI: ""
        });

        emit SettlementFunded(reportId, requester, operator, msg.value, uint64(block.timestamp + timeoutSeconds));
    }

    function acceptSettlement(uint256 reportId) external {
        Settlement storage settlement = settlements[reportId];
        if (settlement.status != SettlementStatus.Funded) revert InvalidStatus();
        if (msg.sender != settlement.requester) revert Unauthorized();

        settlement.status = SettlementStatus.Accepted;
        operatorStats[settlement.operator].acceptedReports += 1;
        operatorStats[settlement.operator].totalEarned += settlement.amount;

        (bool sent, ) = payable(settlement.operator).call{value: settlement.amount}("");
        require(sent, "PAYOUT_FAILED");

        emit SettlementAccepted(reportId, settlement.requester, settlement.operator);
    }

    function disputeSettlement(uint256 reportId, string calldata reasonURI) external {
        Settlement storage settlement = settlements[reportId];
        if (settlement.status != SettlementStatus.Funded) revert InvalidStatus();
        if (msg.sender != settlement.requester) revert Unauthorized();
        if (bytes(reasonURI).length == 0) revert EmptyReason();

        settlement.status = SettlementStatus.Disputed;
        settlement.disputeReasonURI = reasonURI;
        operatorStats[settlement.operator].disputedReports += 1;

        emit SettlementDisputed(reportId, settlement.requester, reasonURI);
    }

    function refundExpired(uint256 reportId) external {
        Settlement storage settlement = settlements[reportId];
        if (
            settlement.status != SettlementStatus.Funded &&
            settlement.status != SettlementStatus.Disputed
        ) revert InvalidStatus();
        if (block.timestamp < settlement.resolveAfter) revert InvalidTimeout();

        settlement.status = SettlementStatus.Refunded;
        uint256 amount = settlement.amount;

        (bool sent, ) = payable(settlement.requester).call{value: amount}("");
        require(sent, "REFUND_FAILED");

        emit SettlementRefunded(reportId, settlement.requester, amount);
    }

    function getSettlement(uint256 reportId) external view returns (Settlement memory) {
        Settlement memory settlement = settlements[reportId];
        if (settlement.status == SettlementStatus.None) revert InvalidReport();
        return settlement;
    }
}
