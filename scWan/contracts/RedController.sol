// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./AdminStorage.sol";


contract RedController is AdminStorage{

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    constructor() {
        owner = msg.sender;
    }
    function setImple(address _imple) public{
        if(msg.sender == owner){
            impl = _imple;
        }

    }


    /**
    * @dev Transfers ownership of the contract to a new account (`newOwner`).
    * Can only be called by the current owner.
    */
    function transferOwnership(address newOwner) public virtual  {
        require(owner == msg.sender,"ownable, msg.sender is ont _owner");
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
    receive() external payable {  }

    /**
        * @dev Delegates execution to an implementation contract.
        * It returns to the external caller whatever the implementation returns
        * or forwards reverts.
    */
    fallback() payable external {
        // delegate all other functions to current implementation
        (bool success, ) = impl.delegatecall(msg.data);

        assembly {
            let free_mem_ptr := mload(0x40)
                returndatacopy(free_mem_ptr, 0, returndatasize())

                switch success
                case 0 { revert(free_mem_ptr, returndatasize()) }
                default { return(free_mem_ptr, returndatasize()) }
        }
    }
}
