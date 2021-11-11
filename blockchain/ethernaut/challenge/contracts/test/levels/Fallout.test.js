const FalloutFactory = artifacts.require('./levels/FalloutFactory.sol')
const Fallout = artifacts.require('./attacks/Fallout.sol')

const HackMac = artifacts.require('./HackMac.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')

contract('Fallout', function(accounts) {

  let hackmac
  let level
  let owner = accounts[1]
  let player = accounts[0]

  beforeEach(async function() {
    hackmac = await HackMac.new();
    level = await FalloutFactory.new()
    await hackmac.registerLevel(level.address)
    //console.log(hackmac.address, level.address)
  });

  it('should allow the player to solve the level', async function() {

    const instance = await utils.createLevelInstance(
      hackmac, level.address, player, Fallout,
      {from: player}
    )

    assert.equal(await instance.owner(), 0x0)

    await instance.Fal1out()
    assert.equal(await instance.owner(), player)

    // Factory check
    const ethCompleted = await utils.submitLevelInstance(
      hackmac,
      level.address,
      instance.address,
      player
    )
    assert.equal(ethCompleted, true)
  });

});
