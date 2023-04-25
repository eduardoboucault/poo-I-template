export class Account {
  constructor(
    private id: string,
    private balance: number,
    private owner_id: string,
    private create_at: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public setId(newId: string): void {
    this.id = newId;
  }

  public getBalance(): number {
    return this.balance;
  }

  public setBalance(newBalance: number): void {
    this.balance += newBalance;
  }

  public getOwner(): string {
    return this.owner_id;
  }

  public setOwner(newOwner: string): void {
    this.owner_id = newOwner;
  }

  public getCreate(): string {
    return this.create_at;
  }
}
