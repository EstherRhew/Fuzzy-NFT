pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";

//import "./ERC721/ERC721.sol";
//import "./ERC721/ERC721Enumerable.sol";

contract Gallery is ERC721, ERC721Enumerable, ERC721Pausable, AccessControlEnumerable {
    event PhotoUploaded (uint indexed tokenId, string metadataURI, uint256 timestamp);

    mapping(uint256 => PhotoData) private _photoList;

    struct PhotoData {
        uint256 tokenId;
        address[] ownerHistory;
        string metadataURI;
        uint256 timestamp;
    }

    string private _baseUri;

    constructor(string memory tokenName, string memory symbol, string memory baseUri) ERC721(tokenName, symbol) {
        _baseUri = baseUri;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, _photoList[tokenId].metadataURI)) : "";
    }

    function uploadPhoto(address owner, string memory metadataURI) public returns (uint256) {
        uint256 tokenId = totalSupply() + 1;

        _mint(msg.sender, tokenId);
        tokenURI(tokenId);

        address[] memory ownerHistory;

        PhotoData memory newPhotoData = PhotoData({
        tokenId: tokenId,
        ownerHistory: ownerHistory,
        metadataURI: metadataURI,
        timestamp : block.timestamp
        });

        _photoList[tokenId] = newPhotoData;
        _photoList[tokenId].ownerHistory.push(msg.sender);

        emit PhotoUploaded(tokenId, metadataURI, block.timestamp);

        return tokenId;
    }

    function transferOwnership(uint256 tokenId, address to) public returns(uint, address, address, address) {
        transferFrom(msg.sender, to, tokenId);
        uint ownerHistoryLength = _photoList[tokenId].ownerHistory.length;
        return (
        _photoList[tokenId].tokenId,
        _photoList[tokenId].ownerHistory[0],
        _photoList[tokenId].ownerHistory[ownerHistoryLength-2],
        _photoList[tokenId].ownerHistory[ownerHistoryLength-1]);
    }

    function transferFrom(address from, address to, uint256 tokenId) override(ERC721, IERC721) public {
        super.transferFrom(from, to, tokenId);
        _photoList[tokenId].ownerHistory.push(to);
    }

    function getTotalPhotoCount () public view returns (uint) {
        return totalSupply();
    }

    function getPhoto(uint tokenId) public view returns(uint256, address[] memory, string memory, uint256) {
        require(_photoList[tokenId].tokenId != 0, "Photo does not exist");
        return (
            _photoList[tokenId].tokenId,
            _photoList[tokenId].ownerHistory,
            _photoList[tokenId].metadataURI,
            _photoList[tokenId].timestamp);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUri;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(AccessControlEnumerable, ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}