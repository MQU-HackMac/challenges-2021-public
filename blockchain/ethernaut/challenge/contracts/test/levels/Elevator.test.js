const ElevatorFactory = artifacts.require('./levels/ElevatorFactory.sol')
const ElevatorAttack = artifacts.require('./attacks/ElevatorAttack.sol')
const Elevator = artifacts.require('./levels/Elevator.sol')

const HackMac = artifacts.require('./HackMac.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')


contract('Elevator', function(accounts) {

  let hackmac
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    hackmac = await HackMac.new();
    level = await ElevatorFactory.new()
    await hackmac.registerLevel(level.address)
  });

  it('should fail if the player didnt solve the level', async function() {
    const instance = await utils.createLevelInstance(hackmac, level.address, player, Elevator)
    const completed = await utils.submitLevelInstance(
      hackmac,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });

  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(hackmac, level.address, player, Elevator)

    const attacker = await ElevatorAttack.new()
    await attacker.attack(instance.address)

    const completed = await utils.submitLevelInstance(
      hackmac,
      level.address,
      instance.address,
      player
    )

    assert.isTrue(completed)
  });
});
