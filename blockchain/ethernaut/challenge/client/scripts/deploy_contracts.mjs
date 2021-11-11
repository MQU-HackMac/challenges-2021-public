import prompt from 'prompt';
import colors from 'colors';
import Web3 from 'web3';
import fs from 'fs';
import * as ethutil from '../src/utils/ethutil.js';
import * as constants from '../src/constants.js';
import HDWalletProvider from '@truffle/hdwallet-provider';
import * as gamedata from '../src/gamedata/gamedata.json';
import * as HackMacABI from 'contracts/build/contracts/HackMac.sol/HackMac.json';

let web3;
let hackmac;

const PROMPT_ON_DEVELOP = true
const DEPLOY_DATA_PATH = `./client/src/gamedata/deploy.${constants.ACTIVE_NETWORK.name}.json`

async function exec() {

  console.log(colors.cyan(`<< NETWORK: ${constants.ACTIVE_NETWORK.name} >>`).inverse)

  await initWeb3()

  // Retrieve deployment data for the active network.
  const deployData = loadDeployData(DEPLOY_DATA_PATH)

  // Determine which contracts need to be deployed.
  let count = 0;
  if(needsDeploy(deployData.hackmac)) {
    count++
    console.log(colors.red(`(${count}) Will deploy HackMac.sol!`))
  }
  gamedata.default.levels.map(level => {
    if(needsDeploy(deployData[level.deployId])) {
      count++
      console.log(colors.cyan(`(${count}) Will deploy ${level.levelContract} (${level.name})`))
    }
  })

  if(count === 0) {
    console.log(colors.gray(`No actions to perform, exiting.`));
    return;
  }

  if(await confirmDeployment()) {
    await deployContracts(deployData)
    storeDeployData(DEPLOY_DATA_PATH, deployData)
    console.log("Done");
    process.exit();
  }
}

exec();

async function deployContracts(deployData) {
  const props = {
    gasPrice: (await web3.eth.getGasPrice()) * 10,
    gas: 4500000
  }

  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if(!from) from = (await web3.eth.getAccounts())[0];
  console.log("FROM: ", from)

  // Deploy/retrieve hackmac contract
  const HackMac = await ethutil.getTruffleContract(HackMacABI.default, {from})
  if(needsDeploy(deployData.hackmac)) {
		console.log(deployData);
    console.log(`Deploying HackMac.sol...`);
    hackmac = await HackMac.new(props)
    console.log(colors.yellow(`  HackMac: ${hackmac.address}`));
    deployData.hackmac = hackmac.address;
  }
  else {
    console.log('Using deployed HackMac.sol:', deployData.hackmac);
    hackmac = await HackMac.at(deployData.hackmac)
    // console.log('hackmac: ', hackmac);
  }

  // Sweep levels
  const promises = gamedata.default.levels.map(async level => {
    // console.log('level: ', level);
    return new Promise(async resolve => {
      if(needsDeploy(deployData[level.deployId])) {
        console.log(`Deploying ${level.levelContract}, deployId: ${level.deployId}...`);

        // Deploy contract
        const LevelABI = JSON.parse(fs.readFileSync(`contracts/build/contracts/levels/${level.levelContract}/${withoutExtension(level.levelContract)}.json`, 'utf-8'))
        const Contract = await ethutil.getTruffleContract(LevelABI, {from})
        const contract = await Contract.new(...level.deployParams, props)
        console.log(colors.yellow(`  ${level.name}: ${contract.address}`));
        deployData[level.deployId] = contract.address
        console.log(colors.gray(`  storing deployed id: ${level.deployId} with address: ${contract.address}`));

        // Register level in HackMac contract
        console.log(`  Registering level ${level.levelContract} in HackMac.sol...`)
        const tx = await hackmac.registerLevel(contract.address, props);
        console.log(`Registered ${level.levelContract}!`)
        // console.log(tx)
      }
      else {
        console.log(`Using deployed ${level.levelContract}...`);
      }
      resolve(level)
    })
  })

  return Promise.all(promises)
}

// ----------------------------------
// Utils
// ----------------------------------

function withoutExtension(str) {
  return str.split('.')[0]
}

function needsDeploy(deployAddress) {
  if(constants.ACTIVE_NETWORK === constants.NETWORKS.LOCAL) return true
  return deployAddress === undefined || deployAddress === 'x'
}

function initWeb3() {
  return new Promise(async (resolve, reject) => {

    let provider
    if(constants.ACTIVE_NETWORK === constants.NETWORKS.LOCAL) {
      const providerUrl = `${constants.ACTIVE_NETWORK.url}:${constants.ACTIVE_NETWORK.port}`
      console.log(colors.gray(`connecting web3 to '${providerUrl}'...`));
      provider = new Web3.providers.HttpProvider(providerUrl);
    } else {
      provider = new HDWalletProvider(
        constants.ACTIVE_NETWORK.privKey,
        constants.ACTIVE_NETWORK.url
      )
    }

    web3 = new Web3(provider)

    web3.eth.net.isListening((err, res) => {
      if(err) {
        console.log('error connecting web3:', err);
        reject()
        return
      }
      console.log(colors.gray(`web3 connected: ${res}\n`));
      ethutil.setWeb3(web3)
      resolve()
    })
  })
}

function loadDeployData(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'))
  }
  catch(err){
    return {}
  }
}

function storeDeployData(path, deployData) {
  console.log(colors.green(`Writing updated deploy data: ${path}`))
  return fs.writeFileSync(path, JSON.stringify(deployData, null, 2), 'utf8')
}

function confirmDeployment() {
  return new Promise((resolve, reject) => {
    resolve(true)
  })
}
