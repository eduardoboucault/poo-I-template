export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string
  ) {}

  public getId(): string {
    return this.id;
  }
  public setId(newId: string): void {
    this.id = newId;
  }

  public getName(): string {
    return this.name;
  }

  public setName(newName: string): void {
    this.email = newName;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(newEmail: string): void {
    this.email = newEmail;
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(newPassword: string): void {
    this.password = newPassword;
  }
}
