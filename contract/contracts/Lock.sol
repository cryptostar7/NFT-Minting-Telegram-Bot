// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMinting is ERC721 {
    mapping(uint256 => string) ret_name;
    mapping(uint256 => string) ret_symbol;
    mapping(uint256 => string) metadata;

    constructor() ERC721("NFT", "NFT") {}

    function mint(address recipient, uint256 )
}
