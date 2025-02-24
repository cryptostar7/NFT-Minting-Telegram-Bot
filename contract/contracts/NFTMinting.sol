// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMinting is ERC721 {
    uint256 private currentTokenId = 0;

    mapping(uint256 => string) private _tokenName;
    mapping(uint256 => string) private _tokenSymbol;
    mapping(uint256 => string) private _tokenMetadata;

    constructor() ERC721("NFT", "NFT") {}

    function mint(string memory name, string memory symbol, string memory metadataURI) public {
        _safeMint(msg.sender, currentTokenId);
        _tokenName[currentTokenId] = name;
        _tokenSymbol[currentTokenId] = symbol;
        _tokenMetadata[currentTokenId] = metadataURI;

        currentTokenId++;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenMetadata[tokenId];
    }
}
