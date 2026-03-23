/**
 * Credential Service
 * All methods call the real backend. No mocks.
 */

import { apiClient } from "../lib/api-client";

export class CredentialService {
  /** Get credentials for the logged-in user */
  async getCredentials() {
    return apiClient.get("/credentials");
  }

  /** Get a single credential by ID */
  async getCredentialById(id) {
    return apiClient.get(`/credentials/${id}`);
  }

  /** Get credentials by DID */
  async getCredentialsByDID(did) {
    return apiClient.get(`/credentials/did/${did}`);
  }

  /** Issue a new credential (verifier only) */
  async issueCredential(credentialData) {
    return apiClient.post("/credentials/issue", credentialData);
  }

  /** Verify a credential by ID (public) */
  async verifyCredential(credentialId) {
    return apiClient.get(`/credentials/verify/${credentialId}`);
  }

  /** Revoke a credential (verifier only) */
  async revokeCredential(credentialId, reason) {
    return apiClient.post(`/credentials/${credentialId}/revoke`, { reason });
  }

  /** Accept a pending credential (student) */
  async acceptCredential(credentialId) {
    return apiClient.post(`/credentials/${credentialId}/accept`, {});
  }

  /** Reject a pending credential (student) */
  async rejectCredential(credentialId, reason) {
    return apiClient.post(`/credentials/${credentialId}/reject`, { reason });
  }

  /** Get pending credential submissions (verifier only) */
  async getPendingSubmissions() {
    return apiClient.get("/credentials/submissions/pending");
  }

  /** Search credentials by criteria */
  async searchCredentials(query) {
    return apiClient.get("/credentials/search", query);
  }

  /** Create a share token for selective disclosure */
  async createShareToken(credentialIds, ttlMinutes = 60) {
    return apiClient.post("/credentials/share", { credentialIds, ttlMinutes });
  }

  /** Resolve a share token */
  async resolveShareToken(token) {
    return apiClient.get(`/credentials/shared/${token}`);
  }

  /** Get DID document */
  async getDIDDocument(did) {
    return apiClient.get(`/did/${did}`);
  }
}

export const credentialService = new CredentialService();