// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LandRegistry {

    struct OwnerRecord {
        address owner;
        uint256 timestamp;
        string action; // "REGISTERED" or "TRANSFERRED"
    }

    struct LandDetails {
        bytes32 landId;
        address currentOwner;
        string location;
        uint256 areaSqMeters;
        bool exists;
    }

    // Core storage
    mapping(bytes32 => LandDetails) private lands;
    mapping(bytes32 => OwnerRecord[]) private ownershipHistory;

    // Events (indexed = filterable by frontend/Go listener)
    event LandRegistered(
        bytes32 indexed landId,
        address indexed owner,
        string location,
        uint256 timestamp
    );

    event OwnershipTransferred(
        bytes32 indexed landId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    // --- Write functions ---

    function registerLand(
        string memory _landId,
        string memory _location,
        uint256 _areaSqMeters
    ) external {
        bytes32 id = keccak256(abi.encodePacked(_landId));
        require(!lands[id].exists, "Land already registered");

        lands[id] = LandDetails({
            landId: id,
            currentOwner: msg.sender,
            location: _location,
            areaSqMeters: _areaSqMeters,
            exists: true
        });

        ownershipHistory[id].push(OwnerRecord({
            owner: msg.sender,
            timestamp: block.timestamp,
            action: "REGISTERED"
        }));

        emit LandRegistered(id, msg.sender, _location, block.timestamp);
    }

    function transferOwnership(
        string memory _landId,
        address _newOwner
    ) external {
        bytes32 id = keccak256(abi.encodePacked(_landId));
        require(lands[id].exists, "Land not registered");
        require(lands[id].currentOwner == msg.sender, "Not the owner");
        require(_newOwner != address(0), "Invalid address");

        address previous = lands[id].currentOwner;
        lands[id].currentOwner = _newOwner;

        ownershipHistory[id].push(OwnerRecord({
            owner: _newOwner,
            timestamp: block.timestamp,
            action: "TRANSFERRED"
        }));

        emit OwnershipTransferred(id, previous, _newOwner, block.timestamp);
    }

    // --- Read functions ---

    function getOwner(string memory _landId) external view returns (address) {
        bytes32 id = keccak256(abi.encodePacked(_landId));
        require(lands[id].exists, "Land not registered");
        return lands[id].currentOwner;
    }

    function getHistory(string memory _landId)
        external view
        returns (OwnerRecord[] memory)
    {
        bytes32 id = keccak256(abi.encodePacked(_landId));
        require(lands[id].exists, "Land not registered");
        return ownershipHistory[id];
    }

    function getLandDetails(string memory _landId)
        external view
        returns (LandDetails memory)
    {
        bytes32 id = keccak256(abi.encodePacked(_landId));
        require(lands[id].exists, "Land not registered");
        return lands[id];
    }
}