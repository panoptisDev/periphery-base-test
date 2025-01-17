const { time } = require('@nomicfoundation/hardhat-network-helpers')
const factory = require('../../util/factory')
const helper = require('../../util/helper')
const DAYS = 86400
const WEEKS = 7 * DAYS
const MIN_LOCK_HEIGHT = 10

require('chai')
  .use(require('chai-as-promised'))
  .should()

describe('Vote Escrow Token: lock', () => {
  let contracts, name, symbol

  before(async () => {
    name = 'Vote Escrow NPM'
    symbol = 'veNPM'

    const [owner] = await ethers.getSigners()
    contracts = await factory.deployProtocol(owner)
    const veNpm = await factory.deployUpgradeable('VoteEscrowToken', owner.address, contracts.store.address, owner.address, name, symbol)

    contracts.veNpm = veNpm
  })

  it('must successfully lock NPM tokens', async () => {
    const [owner, account2] = await ethers.getSigners()
    const amounts = [helper.ether(20_000), helper.ether(50_000)]
    const durations = [10, 20]
    const heights = []
    const timestamps = []

    await contracts.npm.mint(owner.address, amounts[0])
    await contracts.npm.mint(account2.address, amounts[1])

    await contracts.npm.approve(contracts.veNpm.address, amounts[0])
    await contracts.npm.connect(account2).approve(contracts.veNpm.address, amounts[1])

    await contracts.veNpm.lock(amounts[0], durations[0]).should.not.be.rejected
    heights.push(await ethers.provider.getBlockNumber())
    timestamps.push(await time.latest())

    await contracts.veNpm.connect(account2).lock(amounts[1], durations[1]).should.not.be.rejected
    heights.push(await ethers.provider.getBlockNumber())
    timestamps.push(await time.latest())

    ;(await contracts.veNpm._totalLocked()).should.equal(amounts[0] + amounts[1])

    ;(await contracts.veNpm._balances(owner.address)).should.equal(amounts[0])
    ;(await contracts.veNpm._unlockAt(owner.address)).should.equal(timestamps[0] + (durations[0] * WEEKS))
    ;(await contracts.veNpm._minUnlockHeights(owner.address)).should.equal(heights[0] + MIN_LOCK_HEIGHT)

    ;(await contracts.veNpm._balances(account2.address)).should.equal(amounts[1])
    ;(await contracts.veNpm._unlockAt(account2.address)).should.equal(timestamps[1] + (durations[1] * WEEKS))
    ;(await contracts.veNpm._minUnlockHeights(account2.address)).should.equal(heights[1] + MIN_LOCK_HEIGHT)
  })
})
