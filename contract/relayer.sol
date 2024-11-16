// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FractionalLayerNFT is ERC721, ERC721URIStorage, Ownable {
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
        uint256 price;  // Price in ETH
        uint256 sharesAvailable;
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

    // Mappings
    mapping(uint256 => NFTData) public nftData;
    mapping(address => mapping(uint256 => uint256)) public shareBalances;

    // Events
    event NFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 metadataId,
        string attestationId,
        uint256 price
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

    constructor() ERC721("Fractional Layer NFT", "FLNFT") Ownable(msg.sender) {}

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
            shareBalances[params.seller1][params.nftId1] >= params.shares1 &&
            shareBalances[params.seller2][params.nftId2] >= params.shares2,
            "Not enough shares available"
        );
        _;
    }

    function mintNFT(
        string memory uri,
        string memory attestationId,
        uint256 priceInEth
    ) public returns (uint256) {
        require(priceInEth > 0, "Price must be greater than 0");
        
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
            exists: true,
            price: priceInEth,
            sharesAvailable: INITIAL_SHARES
        });

        // Assign all initial shares to the minter
        shareBalances[msg.sender][tokenId] = INITIAL_SHARES;

        emit NFTMinted(tokenId, msg.sender, metadataId, attestationId, priceInEth);
        return tokenId;
    }

    function layerTransfer(
        LayerTransferParams calldata params,
        string memory uri,
        uint256 newPriceInEth
    ) 
        public 
        payable 
        nftExists(params.nftId1)
        nftExists(params.nftId2)
        validateLayerTransfer(params)
    {
        require(newPriceInEth > 0, "New NFT price must be greater than 0");
        
        // Calculate total cost
        uint256 totalCost = _calculateLayerTransferCost(params);
        require(msg.value >= totalCost, "Insufficient payment");

        // Process payments and burn shares
        _processLayerTransferPayments(params);

        // Create new NFT at higher layer
        uint256 newTokenId = _createLayerNFT(params, uri, newPriceInEth);

        // Refund excess payment
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }

        emit LayerTransferCompleted(newTokenId, params.nftId1, params.nftId2, params.newLayer);
    }

    function _calculateLayerTransferCost(LayerTransferParams memory params) private view returns (uint256) {
        uint256 cost1 = nftData[params.nftId1].price * 1 ether;
        uint256 cost2 = nftData[params.nftId2].price * 1 ether;
        return cost1 + cost2;
    }

    function _processLayerTransferPayments(LayerTransferParams memory params) private {
        // Calculate payments
        uint256 payment1 = nftData[params.nftId1].price * 1 ether;
        uint256 payment2 = nftData[params.nftId2].price * 1 ether;

        // Burn shares
        shareBalances[params.seller1][params.nftId1] -= params.shares1;
        shareBalances[params.seller2][params.nftId2] -= params.shares2;

        // Update NFT data
        nftData[params.nftId1].sharesAvailable -= params.shares1;
        nftData[params.nftId2].sharesAvailable -= params.shares2;

        // Transfer payments to sellers
        payable(params.seller1).transfer(payment1);
        payable(params.seller2).transfer(payment2);

        // Emit burn events
        emit SharesBurned(params.nftId1, params.seller1, params.shares1);
        emit SharesBurned(params.nftId2, params.seller2, params.shares2);
    }

    function _createLayerNFT(
        LayerTransferParams memory params,
        string memory uri,
        uint256 newPriceInEth
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
            exists: true,
            price: newPriceInEth,
            sharesAvailable: INITIAL_SHARES
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
}