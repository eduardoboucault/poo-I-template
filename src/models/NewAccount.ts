export class NewAccount {
  constructor(private id: string, private owner_id: string) {}

  public getId(): string {
    return this.id;
  }

  public setId(newId: string): void {
    this.id = newId;
  }

  public getOwnerId(): string {
    return this.owner_id;
  }

  public setOwnerId(newOwnerId: string): void {
    this.owner_id = newOwnerId;
  }
}
