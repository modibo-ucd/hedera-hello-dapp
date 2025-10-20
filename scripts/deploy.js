import hre from 'hardhat';

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(`\nDéploiement du contrat avec le compte: ${deployer.address}`);

  // Récupération du contrat
  const HelloHedera = await hre.ethers.getContractFactory('HelloHedera');

  // Déploiement du contrat avec l'adresse du propriétaire initial
  const helloHedera = await HelloHedera.deploy(deployer.address);

  // Attente de la confirmation du déploiement et récupération de l'adresse
  // await helloHedera.deploymentTransaction().wait();

  await helloHedera.deployed();

  console.log(
    // `\nContrat HelloHedera déployé à l'adresse: ${await helloHedera.getAddress()}\n`
    `\nContrat HelloHedera déployé à l'adresse: ${await helloHedera.address}\n`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
