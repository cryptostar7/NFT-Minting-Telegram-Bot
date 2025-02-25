// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NFTMinting.sol";

contract Factory {
    mapping(string => address) public existAddress;
    mapping(string => uint256) public idCount;

    string[] public existingNFTs;

    event NFTContractCreated(address contractAddress, string name, string symbol);
    
    function createNewNFT(string memory name, string memory symbol, string memory tokenUri) external returns (address) {
        require(existAddress[name] == address(0), "Please rename the token");
        NFTMinting newContract = new NFTMinting(msg.sender, name, symbol, tokenUri);
        existAddress[name] = address(newContract);
        idCount[name] = 2;
        existingNFTs.push(name);
        emit NFTContractCreated(address(newContract), name, symbol);
        return address(newContract);
    }

    function existingNFTMint(string memory name, string memory tokenUri) external {
        require(existAddress[name] != address(0), "NFT does not exist.");
        NFTMinting existingContract = NFTMinting(existAddress[name]);
        existingContract.safeMint(msg.sender, idCount[name], tokenUri);
        idCount[name]++;
    }

    function getExistingNFTs() external view returns (string[] memory) {
        return existingNFTs;
    }
}