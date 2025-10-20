import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artifactPath = path.join(
  __dirname,
  '..',
  'artifacts',
  'contracts',
  'HelloHedera.sol',
  'HelloHedera.json'
);
const outputPath = path.join(__dirname, '..', 'dapp', 'src', 'abi.jsx');

const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

const abiContent = `export const JsonABI = ${JSON.stringify(
  artifact.abi,
  null,
  2
)};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, abiContent);

console.log('ABI exported to dapp/src/abi.jsx');
