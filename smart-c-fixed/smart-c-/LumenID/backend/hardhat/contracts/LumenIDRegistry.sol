// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LumenIDRegistry {

    struct Credential {
        bytes32 claimsHash;
        string  metadataURI;
        string  recipientDID;
        bool    isRevoked;
    }

    mapping(string => Credential) private credentials;
    mapping(string => string)     private didDocuments;
    address public owner;

    event CredentialIssued(
        string indexed credentialId,
        string  recipientDID,
        bytes32 claimsHash,
        string  metadataURI
    );

    event CredentialRevoked(
        string indexed credentialId,
        string  reason
    );

    event DIDRegistered(
        string indexed did,
        string  docURI
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCredential(
        string  calldata credentialId,
        string  calldata recipientDID,
        bytes32          claimsHash,
        string  calldata metadataURI
    ) external onlyOwner {
        credentials[credentialId] = Credential({
            claimsHash:   claimsHash,
            metadataURI:  metadataURI,
            recipientDID: recipientDID,
            isRevoked:    false
        });
        emit CredentialIssued(credentialId, recipientDID, claimsHash, metadataURI);
    }

    function revokeCredential(
        string calldata credentialId,
        string calldata reason
    ) external onlyOwner {
        require(credentials[credentialId].claimsHash != bytes32(0), "Credential not found");
        credentials[credentialId].isRevoked = true;
        emit CredentialRevoked(credentialId, reason);
    }

    function getCredential(string calldata credentialId)
        external
        view
        returns (
            bytes32 claimsHash,
            string memory metadataURI,
            string memory recipientDID,
            bool isRevoked
        )
    {
        Credential memory c = credentials[credentialId];
        return (c.claimsHash, c.metadataURI, c.recipientDID, c.isRevoked);
    }

    function isRevoked(string calldata credentialId)
        external
        view
        returns (bool)
    {
        return credentials[credentialId].isRevoked;
    }

    function registerDID(
        string calldata did,
        string calldata docURI
    ) external onlyOwner {
        didDocuments[did] = docURI;
        emit DIDRegistered(did, docURI);
    }

    function resolveDID(string calldata did)
        external
        view
        returns (string memory docURI)
    {
        return didDocuments[did];
    }
}