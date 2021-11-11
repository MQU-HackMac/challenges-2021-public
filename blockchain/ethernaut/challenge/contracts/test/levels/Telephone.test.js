const Telephone = artifacts.require('./levels/Telephone.sol')
const TelephoneFactory = artifacts.require('./levels/TelephoneFactory.sol')
const TelephoneAttack = artifacts.require('./attacks/TelephoneAttack.sol')

const HackMac = artifacts.require('./HackMac.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')


contract('Telephone', function(accounts) {

  let hackmac
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    hackmac = await HackMac.new();
    level = await TelephoneFactory.new()
    await hackmac.registerLevel(level.address)
  });

  it('should fail if the player did not solve the level', async function() {
    const instance = await utils.createLevelInstance(hackmac, level.address, player, Telephone)

    const completed = await utils.submitLevelInstance(
      hackmac,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });


  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(hackmac, level.address, player, Telephone)

    const attacker = await TelephoneAttack.new()
    await attacker.attack(instance.address, player)

    const completed = await utils.submitLevelInstance(
      hackmac,
      level.address,
      instance.address,
      player
    )
    
    assert.isTrue(completed)
  });

});
