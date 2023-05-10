//import { Alchemy, Network } from 'alchemy-sdk';
require('dotenv').config();
const { ethers } = require('ethers');

// Set your parameters here
const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const oracleContractAddress = '0x7C2A19e54e48718f6C60908a9Cff3396E4Ea1eBA';
const nftContractAddressToMonitor = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';
//const priceThreshold = ethers.BigNumber.from('100'); // Your desired price threshold

// Connect to the Ethereum network via Alchemy
const provider = new ethers.providers.AlchemyProvider('mainnet', alchemyApiKey);

// ABI for the SetAssetTwapPrice event
const eventAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'nftContract', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'twapPrice', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'SetAssetTwapPrice',
    type: 'event',
  },
];

const contractInterface = new ethers.utils.Interface(eventAbi);

async function main() {
  const filter = {
    address: oracleContractAddress,
    topics: [contractInterface.getEventTopic('SetAssetTwapPrice')],
  };

  provider.on(filter, (log) => {
    const event = contractInterface.parseLog(log);

    if (
      event.args.nftContract.toLowerCase() === nftContractAddressToMonitor.toLowerCase()
      //event.args.twapPrice.lt(priceThreshold)
    ) {
      console.log(`TWAP price is: ${event.args.twapPrice.toString()}`);
    }
  });
}

main();
