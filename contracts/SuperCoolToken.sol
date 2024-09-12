// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SuperCoolToken is ERC20, Ownable {
    using SafeMath for uint256;

    uint256 public mintPriceInWei = 10000000000000; // 0.00001 BNB in wei

    constructor() ERC20("SuperCool", "SPU") {
        _mint(msg.sender, 1000000 * 10**decimals()); // Mint initial supply to deployer
    }

    function mint() external payable {
        require(msg.value >= mintPriceInWei, "Insufficient BNB sent");

        uint256 amountToMint = msg.value.div(mintPriceInWei).mul(10**decimals());
        _mint(msg.sender, amountToMint);

        // Refund any excess BNB sent
        if (msg.value > mintPriceInWei) {
            payable(msg.sender).transfer(msg.value.sub(mintPriceInWei));
        }
    }

    function setMintPrice(uint256 newPriceInWei) external onlyOwner {
        mintPriceInWei = newPriceInWei;
    }

    // Function to withdraw BNB from the contract
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
