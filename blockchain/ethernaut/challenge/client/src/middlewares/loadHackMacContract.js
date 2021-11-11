import * as ethutil from '../utils/ethutil'
import HackMacABI from 'contracts/build/contracts/HackMac.sol/HackMac.json'
import * as actions from '../actions';
import { loadTranslations } from '../utils/translations'

let language = localStorage.getItem('lang')
let strings = loadTranslations(language)

const loadHackMacContract = store => next => action => {
  if(action.type !== actions.LOAD_ETHERNAUT_CONTRACT) return next(action)
  if(action.contract !== undefined) return next(action)

  const state = store.getState()
  if(
    !state.network.web3 ||
    !state.player.address ||
    !state.gamedata.hackmacAddress
  ) {
    // console.log(`UNABLE TO LOAD ETHERNAUT`)
    return next(action)
  }
  // console.log(`GETTING ETHERNAUT...`, state.gamedata.hackmacAddress)

  // Get contract template
  const HackMac = ethutil.getTruffleContract(
    HackMacABI,
    {
      from: state.player.address,
      gasPrice: state.network.gasPrice
    }
  )

  // Get deployed instance
  HackMac.at(state.gamedata.hackmacAddress)
    .then(instance => {

      console.info('1')
      console.info(`=> ${strings.hackmacAddressMessage}\n${instance.address}`)
      console.info('2')

      // for player interaction via the browser's console
      window.hackmac = instance

      action.contract = instance
      next(action)

      // Get game data
      store.dispatch(actions.syncLevelProgress())

      // Auto-restore previoius instance
      if(state.gamedata.activeLevel)
        store.dispatch(actions.loadLevelInstance(state.gamedata.activeLevel, true))
    })
    .catch(() => {
      console.error(`@bad ${strings.hackmacNotFoundMessage}`)
    })
}

export default loadHackMacContract