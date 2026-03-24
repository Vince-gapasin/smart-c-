import '@nomicfoundation/hardhat-ethers';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '.env') });

const config = {
  solidity: '0.8.20',
  networks: {
    moonbase: {
      url:      'https://rpc.api.moonbase.moonbeam.network',
      chainId:  1287,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;