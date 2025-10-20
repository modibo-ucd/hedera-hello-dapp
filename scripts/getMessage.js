import hre from 'hardhat';

import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error('CONTRACT_ADDRESS non définie dans le fichier .env');
  }

  console.log(`\nLecture du message depuis le contrat: ${contractAddress}`);

  // Récupération du contrat
  const HelloHedera = await hre.ethers.getContractFactory('HelloHedera');

  // Attachement à l'adresse déployée
  const helloHedera = await HelloHedera.attach(contractAddress);

  // Invocation de getMessage et affichage du résultat
  const message = await helloHedera.getMessage();
  console.log(`\nMessage actuel: ${message}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
