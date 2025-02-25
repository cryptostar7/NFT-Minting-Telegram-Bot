const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { constants, expectRevert } = require('@openzeppelin/test-helpers');


describe("NFT Minting", function () {
  let nftMinting;
  let factory;
  let owner;
  beforeEach("deployment the contract", async function() {
    [owner] = await ethers.getSigners();
    const factoryInstance = await ethers.getContractFactory("Factory");
    factory = await factoryInstance.deploy();
  })

  it("contract addresses must be existd", async function() {
    console.log("Factory deployed to:", await factory.getAddress());
  })

  describe("Create New NFT", function() {
    beforeEach("Create New NFT", async function() {
      await factory.createNewNFT("First NFT", "FNFT", "https://example.com/image.png");
      await factory.createNewNFT("Second NFT", "SNFT", "https://example.com/image.png");
    })

    it("nft's contract address cannot be null", async function() {
      console.log("First NFT's contract address:",await factory.existAddress("First NFT"));
      expect(await factory.existAddress("First NFT")).to.not.equal(constants.ZERO_ADDRESS);
    })

    it("id count of FNFT contract must be 2", async function() {
      expect(await factory.idCount("First NFT")).to.equal(2);
    })

    it("get the array of nfts", async function() {
      console.log(await factory.getExistingNFTs());
    })

    describe("Mint Existing NFTs", async function() {
      beforeEach("Mint Existing NFTs", async function() {
        await factory.existingNFTMint("First NFT", "https://example.com/image123.png");
      })

      it("id count of FNFT contract must be 3", async function() {
        expect(await factory.idCount("First NFT")).to.equal(3);
      })

      it("get all nfts on First NFT contract", async function() {
        console.log(await factory.getExistingNFTs());
      })
    })
  })
});
