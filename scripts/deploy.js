const { ethers, run, network } = require("hardhat");
const { writeFileSync } = require("fs");

async function main() {
    // Get network data from Hardhat config (see hardhat.config.ts).
    const network = process.env.NETWORK;
    // Check if the network is supported.
    console.log(`Deploying to ${network} network...`);

    const Token = await ethers.getContractFactory("SuperCoolToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const address = await token.getAddress();
    console.log("Token deployed to:", address);

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
