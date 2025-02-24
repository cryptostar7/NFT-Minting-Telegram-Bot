// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NFTMinting.sol";

interface INFTMinting {  
    function safeMint(address to, uint256 tokenId, string memory uri) external;  
    function burn(uint256 tokenId) external;  
    function tokenURI(uint256 tokenId) external view returns (string memory);  
    function supportsInterface(bytes4 interfaceId) external view returns (bool);  
}

contract Factory {
    event NFTContractCreated(address contractAddress, string name, string symbol);
    
    function createNFTContract(string memory name, string memory symbol, string memory basicUri) public returns (address) {
        NFTMinting newContract = new NFTMinting(name, symbol, basicUri);
        emit NFTContractCreated(address(newContract), name, symbol);
        return address(newContract);
    }
}