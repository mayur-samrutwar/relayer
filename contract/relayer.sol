// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTShares is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _metadataIdCounter;

    // Constants
    uint256 public constant INITIAL_SHARES = 1000;
    uint256 public constant INITIAL_LAYER = 0;

    // Structs
    struct NFTData {
        uint256 layer;
        uint256 metadataId;
        string attestationId;
        bool exists;
    }

    struct ShareListing {
        uint256 sharesAvailable;
        uint256 pricePerShare;  // Price in ETH
        bool isListed;
    }

    struct LayerTransferParams {
        uint256 nftId1;
        uint256 nftId2;
        uint256 shares1;
        uint256 shares2;
        address seller1;
        address seller2;
        uint256 newLayer;
    }

    struct OwnerDetails {
        address ownerAddress;
        uint256 shares;
        ShareListing listing;
    }

    // Mappings
    mapping(uint256 => NFTData) public nftData;
    mapping(address => mapping(uint256 => uint256)) public shareBalances;
    mapping(uint256 => mapping(address => ShareListing)) public shareListing;
    mapping(uint256 => address[]) private nftOwners;
    mapping(uint256 => mapping(address => bool)) private isOwner;

    // Events
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 metadataId,
        string attestationId
    );
    event SharesListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 shares,
        uint256 pricePerShare
    );
    event SharesUnlisted(
        uint256 indexed tokenId,
        address indexed seller
    );
    event SharesPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed seller,
        uint256 shares,
        uint256 pricePerShare
    );
    event SharesBurned(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 shares
    );
    event LayerTransferCompleted(
        uint256 indexed newTokenId,
        uint256 indexed nftId1,
        uint256 indexed nftId2,
        uint256 newLayer
    );

    constructor() ERC721("NFT Shares", "NFTS") Ownable(msg.sender) {}

    // Modifiers
    modifier nftExists(uint256 tokenId) {
        require(nftData[tokenId].exists, "NFT does not exist");
        _;
    }

    modifier hasEnoughShares(address owner, uint256 tokenId, uint256 shares) {
        require(
            shareBalances[owner][tokenId] >= shares,
            "Not enough shares owned"
        );
        _;
    }

    modifier validateLayerTransfer(LayerTransferParams memory params) {
        require(params.nftId1 != params.nftId2, "Cannot combine the same NFT");
        require(params.shares1 > 0 && params.shares2 > 0, "Shares must be greater than 0");
        require(
            shareListing[params.nftId1][params.seller1].isListed &&
            shareListing[params.nftId2][params.seller2].isListed,
            "Shares not listed for sale"
        );
        require(
            shareListing[params.nftId1][params.seller1].sharesAvailable >= params.shares1 &&
            shareListing[params.nftId2][params.seller2].sharesAvailable >= params.shares2,
            "Not enough shares available"
        );
        _;
    }

    function mintNFT(
        string memory uri,
        string memory attestationId
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        uint256 metadataId = _metadataIdCounter.current();
        _metadataIdCounter.increment();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        nftData[tokenId] = NFTData({
            layer: INITIAL_LAYER,
            metadataId: metadataId,
            attestationId: attestationId,
            exists: true
        });

        shareBalances[msg.sender][tokenId] = INITIAL_SHARES;

        nftOwners[tokenId].push(msg.sender);
        isOwner[tokenId][msg.sender] = true;

        emit NFTMinted(tokenId, msg.sender, metadataId, attestationId);
        return tokenId;
    }

    function listShares(
        uint256 tokenId,
        uint256 shares,
        uint256 pricePerShareInEth
    ) public nftExists(tokenId) hasEnoughShares(msg.sender, tokenId, shares) {
        require(shares > 0, "Must list at least one share");
        require(pricePerShareInEth > 0, "Price must be greater than 0");

        shareListing[tokenId][msg.sender] = ShareListing({
            sharesAvailable: shares,
            pricePerShare: pricePerShareInEth,
            isListed: true
        });

        emit SharesListed(tokenId, msg.sender, shares, pricePerShareInEth);
    }

    function unlistShares(uint256 tokenId) public {
        require(shareListing[tokenId][msg.sender].isListed, "No active listing");
        delete shareListing[tokenId][msg.sender];
        emit SharesUnlisted(tokenId, msg.sender);
    }

    function purchaseSharesFromListing(
        uint256 tokenId,
        address seller,
        uint256 shares
    ) public payable nftExists(tokenId) {
        ShareListing storage listing = shareListing[tokenId][seller];
        require(listing.isListed, "Shares not listed for sale");
        require(listing.sharesAvailable >= shares, "Not enough shares available");
        require(shares > 0, "Must purchase at least one share");

        uint256 totalCostInWei = listing.pricePerShare * 1 ether * shares;
        require(msg.value >= totalCostInWei, "Insufficient payment");

        // Transfer shares
        shareBalances[seller][tokenId] -= shares;
        shareBalances[msg.sender][tokenId] += shares;
        
        // Update listing
        listing.sharesAvailable -= shares;
        if (listing.sharesAvailable == 0) {
            delete shareListing[tokenId][seller];
        }

        // Transfer payment to seller
        payable(seller).transfer(totalCostInWei);

        // Refund excess payment
        if (msg.value > totalCostInWei) {
            payable(msg.sender).transfer(msg.value - totalCostInWei);
        }

        // Add new owner to the list if not already present
        if (!isOwner[tokenId][msg.sender]) {
            nftOwners[tokenId].push(msg.sender);
            isOwner[tokenId][msg.sender] = true;
        }

        // Remove seller from owners list if they sold all shares
        if (shareBalances[seller][tokenId] == 0) {
            _removeOwner(tokenId, seller);
        }

        emit SharesPurchased(tokenId, msg.sender, seller, shares, listing.pricePerShare);
    }

    function layerTransfer(
        LayerTransferParams calldata params,
        string memory uri
    ) 
        public 
        payable 
        nftExists(params.nftId1)
        nftExists(params.nftId2)
        validateLayerTransfer(params)
    {
        // Calculate total cost
        uint256 totalCost = _calculateLayerTransferCost(params);
        require(msg.value >= totalCost, "Insufficient payment");

        // Process payments and burn shares
        _processLayerTransferPayments(params);

        // Create new NFT at higher layer
        uint256 newTokenId = _createLayerNFT(params, uri);

        // Refund excess payment
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        emit LayerTransferCompleted(newTokenId, params.nftId1, params.nftId2, params.newLayer);
    }

    function _calculateLayerTransferCost(LayerTransferParams memory params) private view returns (uint256) {
        uint256 cost1 = shareListing[params.nftId1][params.seller1].pricePerShare * 1 ether * params.shares1;
        uint256 cost2 = shareListing[params.nftId2][params.seller2].pricePerShare * 1 ether * params.shares2;
        return cost1 + cost2;
    }

    function _processLayerTransferPayments(LayerTransferParams memory params) private {
        ShareListing storage listing1 = shareListing[params.nftId1][params.seller1];
        ShareListing storage listing2 = shareListing[params.nftId2][params.seller2];

        // Calculate payments
        uint256 payment1 = listing1.pricePerShare * 1 ether * params.shares1;
        uint256 payment2 = listing2.pricePerShare * 1 ether * params.shares2;

        // Update share balances and burn shares
        shareBalances[params.seller1][params.nftId1] -= params.shares1;
        shareBalances[params.seller2][params.nftId2] -= params.shares2;

        // Update listings
        listing1.sharesAvailable -= params.shares1;
        listing2.sharesAvailable -= params.shares2;

        if (listing1.sharesAvailable == 0) {
            delete shareListing[params.nftId1][params.seller1];
        }
        if (listing2.sharesAvailable == 0) {
            delete shareListing[params.nftId2][params.seller2];
        }

        // Transfer payments to sellers
        payable(params.seller1).transfer(payment1);
        payable(params.seller2).transfer(payment2);

        // Emit burn events
        emit SharesBurned(params.nftId1, params.seller1, params.shares1);
        emit SharesBurned(params.nftId2, params.seller2, params.shares2);
    }

    function _createLayerNFT(
        LayerTransferParams memory params,
        string memory uri
    ) private returns (uint256) {
        uint256 newTokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        uint256 newMetadataId = _metadataIdCounter.current();
        _metadataIdCounter.increment();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, uri);

        nftData[newTokenId] = NFTData({
            layer: params.newLayer,
            metadataId: newMetadataId,
            attestationId: "",
            exists: true
        });

        // Assign initial shares to minter
        shareBalances[msg.sender][newTokenId] = INITIAL_SHARES;

        return newTokenId;
    }

    // View functions
    function getNFTData(
        uint256 tokenId
    ) public view nftExists(tokenId) returns (NFTData memory) {
        return nftData[tokenId];
    }

    function getShareBalance(
        address owner,
        uint256 tokenId
    ) public view returns (uint256) {
        return shareBalances[owner][tokenId];
    }

    function getShareListing(
        uint256 tokenId,
        address seller
    ) public view returns (ShareListing memory) {
        return shareListing[tokenId][seller];
    }

    // Override required functions
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Add this function to get all owners and their details
    function getNFTOwners(uint256 tokenId) 
        public 
        view 
        nftExists(tokenId) 
        returns (OwnerDetails[] memory) 
    {
        address[] memory owners = nftOwners[tokenId];
        OwnerDetails[] memory details = new OwnerDetails[](owners.length);
        
        for (uint i = 0; i < owners.length; i++) {
            address owner = owners[i];
            details[i] = OwnerDetails({
                ownerAddress: owner,
                shares: shareBalances[owner][tokenId],
                listing: shareListing[tokenId][owner]
            });
        }
        
        return details;
    }

    // Add helper function to remove owner
    function _removeOwner(uint256 tokenId, address owner) private {
        for (uint i = 0; i < nftOwners[tokenId].length; i++) {
            if (nftOwners[tokenId][i] == owner) {
                // Move the last element to the position being deleted
                nftOwners[tokenId][i] = nftOwners[tokenId][nftOwners[tokenId].length - 1];
                // Remove the last element
                nftOwners[tokenId].pop();
                isOwner[tokenId][owner] = false;
                break;
            }
        }
    }
}