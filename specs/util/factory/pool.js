const { deployProtocol } = require('./protocol')
const { deployUpgradeable } = require('./deployer')
const key = require('../key')

const deployPool = async (signer) => {
  const { npm, store, protocol } = await deployProtocol(signer)

  const primeDappsPod = await deployUpgradeable('FakeToken', 'Yield Earning USDC', 'iUSDC-PRI')
  const popularDefiAppsPod = await deployUpgradeable('FakeToken', 'Yield Earning USDC', 'iUSDC-POP')

  const veNpm = await deployUpgradeable('VoteEscrowToken', signer.address, store.address, signer.address, 'Vote Escrow NPM', 'veNPM')

  const registry = await deployUpgradeable('GaugeControllerRegistry', signer.address, store.address)

  const candidates = [{
    key: key.toBytes32('prime'),
    pool: {
      name: 'Prime dApps',
      info: '',
      platformFee: 1000,
      staking: {
        pod: primeDappsPod.address,
        lockupPeriodInBlocks: 10_000,
        ratio: 2000
      }
    }
  },
  {
    key: key.toBytes32('popular-defi-apps'),
    pool: {
      name: 'Popular DeFi Apps',
      info: '',
      platformFee: 1500,
      staking: {
        pod: popularDefiAppsPod.address,
        lockupPeriodInBlocks: 10_000,
        ratio: 2000
      }
    }
  }]

  for (const candidate of candidates) {
    await registry.addOrEditPool(candidate.key, candidate.pool)
  }

  return { args: { candidates }, pods: { primeDappsPod, popularDefiAppsPod }, npm, veNpm, store, protocol, registry }
}

module.exports = { deployPool }
