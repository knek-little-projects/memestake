import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("","") {
        _mint(msg.sender, 1e27);
    }
}