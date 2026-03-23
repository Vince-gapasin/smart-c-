/**
 * mock-data.js
 * In-memory store for development. Replace with a database later.
 * All mutations (issue, revoke, accept) update these arrays at runtime.
 */

import bcrypt from 'bcryptjs';

// ─────────────────────────────────────────────
// USERS  (role: "customer" | "verifier")
// ─────────────────────────────────────────────
export const mockUsers = [
  {
    id: 'user-001',
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    // Plain: password123
    password: bcrypt.hashSync('password123', 10),
    role: 'customer',
    did: 'did:lumen:student:john-doe-001',
    walletAddress: null,
    profileComplete: false,
    createdAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'user-002',
    fullName: 'Jane Smith',
    email: 'jane.smith@email.com',
    // Plain: password123
    password: bcrypt.hashSync('password123', 10),
    role: 'customer',
    did: 'did:lumen:student:jane-smith-002',
    walletAddress: null,
    profileComplete: true,
    createdAt: '2024-02-01T08:00:00.000Z',
  },
  {
    id: 'admin-001',
    fullName: 'LumenID Admin',
    email: 'admin@lumenid.edu',
    // Plain: admin123
    password: bcrypt.hashSync('admin123', 10),
    role: 'verifier',
    did: 'did:lumen:issuer:lumenid-university',
    walletAddress: '0xAdminWalletAddress000',
    twoFactorCode: '123456', // Fixed mock 2FA code
    profileComplete: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

// ─────────────────────────────────────────────
// DID DOCUMENTS
// ─────────────────────────────────────────────
export const mockDIDDocuments = {
  'did:lumen:issuer:lumenid-university': {
    '@context': ['https://www.w3.org/ns/did/v1'],
    id: 'did:lumen:issuer:lumenid-university',
    controller: 'did:lumen:issuer:lumenid-university',
    verificationMethod: [
      {
        id: 'did:lumen:issuer:lumenid-university#key-1',
        type: 'JsonWebKey2020',
        controller: 'did:lumen:issuer:lumenid-university',
        publicKeyJwk: { kty: 'EC', crv: 'P-256', x: 'mock-x', y: 'mock-y' },
      },
    ],
    service: [
      {
        id: 'did:lumen:issuer:lumenid-university#credential-registry',
        type: 'CredentialRegistry',
        serviceEndpoint: 'https://api.lumenid.edu/credentials',
      },
    ],
  },
  'did:lumen:student:john-doe-001': {
    '@context': ['https://www.w3.org/ns/did/v1'],
    id: 'did:lumen:student:john-doe-001',
    controller: 'did:lumen:student:john-doe-001',
    verificationMethod: [
      {
        id: 'did:lumen:student:john-doe-001#key-1',
        type: 'JsonWebKey2020',
        controller: 'did:lumen:student:john-doe-001',
        publicKeyJwk: { kty: 'EC', crv: 'P-256', x: 'mock-x', y: 'mock-y' },
      },
    ],
  },
};

// ─────────────────────────────────────────────
// CREDENTIALS
// status: "pending" | "active" | "rejected" | "revoked"
// ─────────────────────────────────────────────
export const mockCredentials = [
  {
    id: 'cred-001',
    type: 'UniversityDegreeCredential',
    issuer: 'LumenID University',
    issuerDID: 'did:lumen:issuer:lumenid-university',
    recipient: 'John Doe',
    recipientDID: 'did:lumen:student:john-doe-001',
    recipientUserId: 'user-001',
    issuedDate: '2024-05-20T09:00:00.000Z',
    status: 'active',
    claims: {
      fullName: 'John Doe',
      program: 'Bachelor of Science in Computer Science',
      gpa: '3.85',
      major: 'Software Engineering',
      academicHonors: "Dean's List",
    },
    schema: 'UniversityDegreeCredential (JSON-LD)',
    blockchainHash: '0xabc123def456mock000000000000000000000001',
    nftMetadataURI: 'ipfs://QmMockHashForDiplomaJohnDoe001',
    nftImageURI: 'ipfs://QmMockImageJohnDoe001',
  },
  {
    id: 'cred-002',
    type: 'CertificateCredential',
    issuer: 'LumenID University',
    issuerDID: 'did:lumen:issuer:lumenid-university',
    recipient: 'John Doe',
    recipientDID: 'did:lumen:student:john-doe-001',
    recipientUserId: 'user-001',
    issuedDate: '2024-06-01T09:00:00.000Z',
    status: 'pending',
    claims: {
      title: 'Web3 Development Certificate',
      issuingOrganization: 'LumenID University',
      issueDate: '2024-06-01',
      expirationDate: '2027-06-01',
      credentialId: 'CERT-WEB3-2024-001',
    },
    schema: 'CertificateCredential (JSON-LD)',
    blockchainHash: null,
    nftMetadataURI: null,
    nftImageURI: null,
  },
  {
    id: 'cred-003',
    type: 'BadgeCredential',
    issuer: 'LumenID University',
    issuerDID: 'did:lumen:issuer:lumenid-university',
    recipient: 'Jane Smith',
    recipientDID: 'did:lumen:student:jane-smith-002',
    recipientUserId: 'user-002',
    issuedDate: '2024-07-10T09:00:00.000Z',
    status: 'active',
    claims: {
      title: 'Academic Excellence Badge',
      issuingOrganization: 'LumenID University',
      issueDate: '2024-07-10',
      expirationDate: null,
      credentialId: 'BADGE-EXCEL-2024-003',
    },
    schema: 'BadgeCredential (JSON-LD)',
    blockchainHash: '0xdef789ghi012mock000000000000000000000003',
    nftMetadataURI: 'ipfs://QmMockHashForBadgeJaneSmith003',
    nftImageURI: 'ipfs://QmMockImageJaneSmith003',
  },
];

// ─────────────────────────────────────────────
// SHARE TOKENS  { token → { credentialIds, expiresAt, ownerId } }
// ─────────────────────────────────────────────
export const mockShareTokens = new Map();

// ─────────────────────────────────────────────
// ADMIN STATS
// ─────────────────────────────────────────────
export const mockAdminStats = [
  {
    label: 'Credentials Issued',
    value: '2,847',
    change: '+12%',
    gradient: 'from-violet-500 to-purple-500',
    bgClass: 'bg-violet-500/10',
    textClass: 'text-violet-500',
    iconName: 'MintCredentialIcon',
  },
  {
    label: 'Verifications Today',
    value: '1,394',
    change: '+8%',
    gradient: 'from-green-500 to-emerald-500',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-500',
    iconName: 'CheckCircle2',
  },
  {
    label: 'Pending Reviews',
    value: '23',
    change: '-5%',
    gradient: 'from-yellow-500 to-amber-500',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-500',
    iconName: 'Clock',
  },
  {
    label: 'Active Users',
    value: '15,429',
    change: '+18%',
    gradient: 'from-cyan-500 to-blue-500',
    bgClass: 'bg-cyan-500/10',
    textClass: 'text-cyan-500',
    iconName: 'Users',
  },
];
