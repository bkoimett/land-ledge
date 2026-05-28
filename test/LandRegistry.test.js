const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandRegistry", function () {
  let contract, owner, addr1;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("LandRegistry");
    contract = await Factory.deploy();
  });

  it("registers land and emits event", async () => {
    await expect(contract.registerLand("KSM-001", "Kisumu, Kondele", 500))
      .to.emit(contract, "LandRegistered")
      .withArgs(
        ethers.keccak256(ethers.toUtf8Bytes("KSM-001")),
        owner.address,
        "Kisumu, Kondele",
        // timestamp — use anyValue from chai-as-promised
      );
    expect(await contract.getOwner("KSM-001")).to.equal(owner.address);
  });

  it("prevents duplicate registration", async () => {
    await contract.registerLand("KSM-002", "Kisumu, Milimani", 300);
    await expect(
      contract.registerLand("KSM-002", "Kisumu, Milimani", 300)
    ).to.be.revertedWith("Land already registered");
  });

  it("transfers ownership correctly", async () => {
    await contract.registerLand("KSM-003", "Kisumu, Mamboleo", 400);
    await contract.transferOwnership("KSM-003", addr1.address);
    expect(await contract.getOwner("KSM-003")).to.equal(addr1.address);
  });

  it("rejects transfer from non-owner", async () => {
    await contract.registerLand("KSM-004", "Kisumu, Lolwe", 200);
    await expect(
      contract.connect(addr1).transferOwnership("KSM-004", addr1.address)
    ).to.be.revertedWith("Not the owner");
  });

  it("returns full ownership history", async () => {
    await contract.registerLand("KSM-005", "Kisumu, Nyamasaria", 600);
    await contract.transferOwnership("KSM-005", addr1.address);
    const history = await contract.getHistory("KSM-005");
    expect(history.length).to.equal(2);
    expect(history[0].action).to.equal("REGISTERED");
    expect(history[1].action).to.equal("TRANSFERRED");
  });
});