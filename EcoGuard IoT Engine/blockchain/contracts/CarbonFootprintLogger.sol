// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarbonFootprintLogger {
    address public owner;

    struct CarbonRecord {
        uint256 timestamp;
        uint256 ppmValue;
    }

    CarbonRecord[] public records;

    // Emitting an event is much cheaper than storing state, good for frontend listening
    event DataLogged(uint256 indexed timestamp, uint256 ppmValue);

    modifier onlyOwner() {
        require(msg.sender == owner, "Security Alert: Only the authorized hardware node can log data");
        _;
    }

    constructor() {
        owner = msg.sender; // The wallet that deploys this becomes the authorized logger
    }

    function logData(uint256 _ppmValue) public onlyOwner {
        records.push(CarbonRecord(block.timestamp, _ppmValue));
        emit DataLogged(block.timestamp, _ppmValue);
    }

    function getRecordCount() public view returns (uint256) {
        return records.length;
    }

    function getLatestRecord() public view returns (uint256, uint256) {
        require(records.length > 0, "No records found on-chain");
        CarbonRecord memory latest = records[records.length - 1];
        return (latest.timestamp, latest.ppmValue);
    }
}