const { ethers } = require('hardhat');

async function main() {
  const [owner] = await ethers.getSigners();
  console.log('Owner address ', await owner.getAddress());

  const factory = await ethers.getContractFactory('Factory');
  const factoryContract = await factory.deploy();
  console.log('\tKey Contract deployed at:', await factoryContract.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
