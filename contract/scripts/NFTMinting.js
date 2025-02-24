import { ethers } from 'hardhat';

async function main() {
  const [owner] = await ethers.getSigners();
  console.log('Owner address ', await owner.getAddress());

  const Key = await ethers.getContractFactory('Key');
  const BaseURI = "ipfs/QmQLQ6dNvcM883JzAKZAH6NoonMv7NYMSYL1SMtbxWcqaN";
  const initialOwner = await owner.getAddress(); // 0xb2530c5d8496677353166cb4E705093bD800251D
  const name = 'Key';
  const symbol = 'KEY';
  const key = await Key.deploy(name, symbol, BaseURI);
  console.log('\tKey Contract deployed at:', await key.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
