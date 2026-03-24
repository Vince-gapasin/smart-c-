const PINATA_JWT   = process.env.PINATA_JWT;
const IPFS_GATEWAY = (process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/').replace(/\/$/, '') + '/';
const IPFS_ENABLED = Boolean(PINATA_JWT);

const PINATA_PIN_FILE_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_PIN_JSON_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

if (!IPFS_ENABLED) {
  console.warn(
    '[ipfs] PINATA_JWT not set — running in MOCK mode. ' +
    'Image/metadata uploads will be skipped.'
  );
}

const toGatewayURL = (uri) => {
  if (!uri) return null;
  if (uri.startsWith('https://') || uri.startsWith('http://')) return uri;
  if (uri.startsWith('ipfs://')) return `${IPFS_GATEWAY}${uri.slice(7)}`;
  return `${IPFS_GATEWAY}${uri}`;
};

const decodeDataURI = (dataURI) => {
  const match = dataURI.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) throw new Error('nftImageURI is not a valid base64 data-URI');
  const mimeType  = match[1];
  const buffer    = Buffer.from(match[2], 'base64');
  const extension = mimeType.split('/')[1] || 'bin';
  return { buffer, mimeType, extension };
};

const authHeaders = () => ({ Authorization: `Bearer ${PINATA_JWT}` });

export const uploadImage = async (base64DataURI, filename = 'credential-nft') => {
  if (!IPFS_ENABLED || !base64DataURI) return null;

  const { buffer, mimeType, extension } = decodeDataURI(base64DataURI);
  const safeFilename = `${filename}.${extension}`;

  const formData = new FormData();
  formData.append('file', new Blob([buffer], { type: mimeType }), safeFilename);
  formData.append('pinataMetadata', JSON.stringify({ name: safeFilename }));
  formData.append('pinataOptions',  JSON.stringify({ cidVersion: 1 }));

  const response = await fetch(PINATA_PIN_FILE_URL, {
    method:  'POST',
    headers: authHeaders(),
    body:    formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`[ipfs] uploadImage failed (${response.status}): ${text}`);
  }

  const { IpfsHash } = await response.json();
  return `ipfs://${IpfsHash}`;
};

export const uploadMetadata = async (metadata) => {
  if (!IPFS_ENABLED) return null;

  const response = await fetch(PINATA_PIN_JSON_URL, {
    method:  'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pinataContent:  metadata,
      pinataMetadata: { name: `${metadata.name || 'credential'}-metadata.json` },
      pinataOptions:  { cidVersion: 1 },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`[ipfs] uploadMetadata failed (${response.status}): ${text}`);
  }

  const { IpfsHash } = await response.json();
  return `ipfs://${IpfsHash}`;
};

export const pinCredentialAssets = async ({
  credentialId, type, issuer, recipient, issuedDate, claims, nftImageDataURI,
}) => {
  let nftImageURI = null;
  if (nftImageDataURI?.startsWith('data:')) {
    nftImageURI = await uploadImage(nftImageDataURI, `${credentialId}-image`);
  } else if (nftImageDataURI) {
    nftImageURI = nftImageDataURI;
  }

  const metadata = {
    name:         `${type} — ${recipient}`,
    description:  `Verifiable credential issued by ${issuer} on ${issuedDate}`,
    image:        nftImageURI || '',
    external_url: `https://lumenid.edu/credentials/${credentialId}`,
    attributes:   Object.entries(claims).map(([trait_type, value]) => ({
      trait_type,
      value: String(value),
    })),
    lumenid: { credentialId, credentialType: type, issuer, recipient, issuedDate },
  };

  const nftMetadataURI = await uploadMetadata(metadata);
  return { nftImageURI, nftMetadataURI };
};

export const fetchFromIPFS = async (ipfsURI) => {
  if (!ipfsURI) return null;

  const response = await fetch(toGatewayURL(ipfsURI), {
    headers: { Accept: 'application/json' },
    signal:  AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`[ipfs] fetchFromIPFS failed (${response.status}) for ${toGatewayURL(ipfsURI)}`);
  }

  return response.json();
};

export const ipfsStatus = () => ({
  enabled:       IPFS_ENABLED,
  jwtConfigured: Boolean(PINATA_JWT),
  gateway:       IPFS_GATEWAY,
});