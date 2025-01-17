const { setGauge } = require('./gauge')
const { deployUpgradeable } = require('./deployer')

const deployLiquidityGaugePool = async (signer) => {
  const contracts = await setGauge(signer)

  const gaugePool = await deployUpgradeable('LiquidityGaugePool', signer.address, contracts.veNpm.address, contracts.registry.address, contracts.store.address, signer.address)

  contracts.gaugePool = gaugePool
  return contracts
}

module.exports = { deployLiquidityGaugePool }
