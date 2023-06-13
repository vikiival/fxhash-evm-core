// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

interface IIssuer {
    struct UserActions {
        uint256 lastIssuerMinted;
        uint256 lastIssuerMintedTime;
        uint256[] lastMinted;
        uint256 lastMintedTime;
    }

    function getUserActions(
        address addr
    ) external view returns (UserActions memory);
}
