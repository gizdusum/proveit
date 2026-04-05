// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ReportRegistry {
    enum ReportMode {
        Governance,
        TokenRisk,
        Treasury,
        UpgradeRisk
    }

    enum Recommendation {
        Unknown,
        Go,
        Revise,
        Avoid
    }

    struct ReportRecord {
        uint256 reportId;
        address requester;
        address operator;
        ReportMode mode;
        Recommendation recommendation;
        uint16 confidenceBps;
        uint64 createdAt;
        bytes32 verdictHash;
        bytes32 reportHash;
        string contentURI;
        string title;
    }

    error EmptyTitle();
    error InvalidAddress();
    error InvalidConfidence();
    error InvalidHash();
    error InvalidReport();

    uint256 public nextReportId = 1;

    mapping(uint256 => ReportRecord) private reports;
    mapping(address => uint64) public requesterReportCount;
    mapping(address => uint64) public operatorReportCount;

    event ReportRegistered(
        uint256 indexed reportId,
        address indexed requester,
        address indexed operator,
        ReportMode mode,
        Recommendation recommendation,
        uint16 confidenceBps,
        bytes32 verdictHash,
        bytes32 reportHash,
        string contentURI
    );

    function registerReport(
        address operator,
        ReportMode mode,
        Recommendation recommendation,
        uint16 confidenceBps,
        bytes32 verdictHash,
        bytes32 reportHash,
        string calldata contentURI,
        string calldata title
    ) external returns (uint256 reportId) {
        if (msg.sender == address(0) || operator == address(0)) revert InvalidAddress();
        if (bytes(title).length == 0) revert EmptyTitle();
        if (confidenceBps > 10_000) revert InvalidConfidence();
        if (verdictHash == bytes32(0) || reportHash == bytes32(0)) revert InvalidHash();

        reportId = nextReportId++;
        reports[reportId] = ReportRecord({
            reportId: reportId,
            requester: msg.sender,
            operator: operator,
            mode: mode,
            recommendation: recommendation,
            confidenceBps: confidenceBps,
            createdAt: uint64(block.timestamp),
            verdictHash: verdictHash,
            reportHash: reportHash,
            contentURI: contentURI,
            title: title
        });

        requesterReportCount[msg.sender] += 1;
        operatorReportCount[operator] += 1;

        emit ReportRegistered(
            reportId,
            msg.sender,
            operator,
            mode,
            recommendation,
            confidenceBps,
            verdictHash,
            reportHash,
            contentURI
        );
    }

    function getReport(uint256 reportId) external view returns (ReportRecord memory) {
        ReportRecord memory record = reports[reportId];
        if (record.requester == address(0)) revert InvalidReport();
        return record;
    }

    function requesterOf(uint256 reportId) external view returns (address) {
        ReportRecord memory record = reports[reportId];
        if (record.requester == address(0)) revert InvalidReport();
        return record.requester;
    }

    function operatorOf(uint256 reportId) external view returns (address) {
        ReportRecord memory record = reports[reportId];
        if (record.requester == address(0)) revert InvalidReport();
        return record.operator;
    }
}
