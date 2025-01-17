// Neptune Mutual Protocol (https://neptunemutual.com)
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.12;

import "../../dependencies/interfaces/IStore.sol";

abstract contract FakeVoteEscrowTokenStateV2 {
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //                                           Version 1
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  address public _feeTo;
  uint256 public _totalLocked;
  mapping(address => bool) public _whitelist;
  mapping(address => bool) public _pausers;

  mapping(address => uint256) public _balances;
  mapping(address => uint256) public _unlockAt;
  mapping(address => uint256) public _minUnlockHeights;

  IStore public _s;

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //                                           Version 2
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  string public _name;
  address public _treasury;
  uint256 public _lastInitializedOn;
  mapping(address => bool) public _members;
  mapping(address => uint256) public _boosts;
}
