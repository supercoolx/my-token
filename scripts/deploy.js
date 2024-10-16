const { ethers, run } = require("hardhat");
const { writeFileSync } = require("fs");

async function main() {
    const network = process.env.NETWORK;
    console.log(`Deploying to ${network} network...`);

    const [owner] = await ethers.getSigners();
    const ownerAddress = await owner.getAddress();
    console.log('Owner wallet:', ownerAddress);

    const beforeBalance = await ethers.provider.getBalance(ownerAddress);
    console.log('Owner balance:', ethers.formatEther(beforeBalance));

    const Token = await ethers.getContractFactory("SuperCoolToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const address = await token.getAddress();
    console.log("Token deployed to:", address);

    const afterBalance = await ethers.provider.getBalance(ownerAddress);
    console.log('Owner balance:', ethers.formatEther(afterBalance));

    const totalSpent = beforeBalance - afterBalance;
    console.log('Total spent:', ethers.formatEther(totalSpent), 'BNB');

    await run('verify:verify', {
        address: address,
        constructorArguments: []        
    });

    // Write the address to a file.
    writeFileSync(
        `./deployments/${network}.json`,
        JSON.stringify({ Token: address }, null, 2)
    );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
