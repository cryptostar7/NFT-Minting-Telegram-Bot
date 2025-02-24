const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Minting", function () {
  let nftMinting;
  beforeEach("deployment the contract", async function() {
    const nftMintingInstance = await ethers.getContractFactory("NFTMinting");
    nftMinting = await nftMintingInstance.deploy();

    console.log("NFTMinting deployed to:", await nftMinting.getAddress());
  })

  it("Mint NFTs", async function() {
    await nftMinting.mint("First Mint", "FMT", "https://example.com/image.png");
    console.log(await nftMinting.name(0));
    // expect(await nftMinting.name(0)).to.equal("First Mint");
  })

});
