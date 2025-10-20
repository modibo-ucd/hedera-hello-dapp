import hre from 'hardhat';

import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error('CONTRACT_ADDRESS non définie dans le fichier .env');
  }

  const newMessage = 'Nouveau message pour Hedera!';

  console.log(`\nMise à jour du message dans le contrat: ${contractAddress}`);
  console.log(`Nouveau message: ${newMessage}`);

  // Récupération du contrat
  const HelloHedera = await hre.ethers.getContractFactory('HelloHedera');

  // Attachement à l'adresse déployée
  const helloHedera = await HelloHedera.attach(contractAddress);

  // Invocation de setMessage avec le nouveau message
  const tx = await helloHedera.setMessage(newMessage);
  await tx.wait();

  console.log('Message mis à jour avec succès!');
  console.log(`\nHash de la transaction: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
