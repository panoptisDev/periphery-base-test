// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.12;

contract VoteEscrowLocker {
  mapping(address => uint256) private _balances;
  mapping(address => uint256) private _unlockAt;
  mapping(address => uint256) private _minUnlockHeights;

  event VoteEscrowUnlock(address indexed accocunt, uint256 amount, uint256 unlockAt, uint256 penalty);
  event VoteEscrowLock(address indexed accocunt, uint256 amount, uint256 durationInWeeks, uint256 previousUnlockAt, uint256 unlockAt, uint256 previousBalance, uint256 balance);

  function _lock(address account, uint256 amount, uint256 durationInWeeks) internal {
    uint256 _MIN_LOCK_HEIGHT = 10;

    require(durationInWeeks >= 4 && durationInWeeks <= 208, "Error: invalid period");

    uint256 previousBalance = _balances[account];

    uint256 newUnlockTimestamp = block.timestamp + (durationInWeeks * 7 days);

    emit VoteEscrowLock(account, amount, durationInWeeks, _unlockAt[account], newUnlockTimestamp, previousBalance, _balances[account]);

    _balances[account] += amount;
    _unlockAt[account] = newUnlockTimestamp;
    _minUnlockHeights[account] = block.number + _MIN_LOCK_HEIGHT;
  }

  function _unlock(address account, uint256 penalty) internal returns (uint256 amount) {
    amount = _balances[account];
    uint256 unlockAt = _unlockAt[account];

    require(amount > 0, "Error: nothing to withdraw");

    _unlockAt[account] = 0;
    _balances[account] = 0;

    emit VoteEscrowUnlock(account, amount, unlockAt, penalty);
  }

  function _getLockedTokenBalance(address account) internal view returns (uint256) {
    return _balances[account];
  }

  function _getUnlockTimestamp(address account) internal view returns (uint256) {
    return _unlockAt[account];
  }

  function _getMinUnlockHeight(address account) internal view returns (uint256) {
    return _minUnlockHeights[account];
  }
}
