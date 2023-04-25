import express, { Request, Response } from "express";
import cors from "cors";
import { TAccountDB, TAccountDBPost, TUserDB, TUserDBPost } from "./types";
import { db } from "./database/knex";
import { User } from "./models/User";
import { Account } from "./models/Account";
import { NewAccount } from "./models/NewAccount";
import { create } from "domain";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const q = req.query.q;

    let usersDB;

    if (q) {
      const result: TUserDB[] = await db("users").where(
        "name",
        "LIKE",
        `%${q}%`
      );
      usersDB = result;
    } else {
      const result: TUserDB[] = await db("users");
      usersDB = result;
    }

    const users: User[] = usersDB.map(
      (userDB) =>
        new User(userDB.id, userDB.name, userDB.email, userDB.password)
    );

    res.status(200).send(users);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, name, email, password } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser string");
    }

    if (typeof name !== "string") {
      res.status(400);
      throw new Error("'name' deve ser string");
    }

    if (typeof email !== "string") {
      res.status(400);
      throw new Error("'email' deve ser string");
    }

    if (typeof password !== "string") {
      res.status(400);
      throw new Error("'password' deve ser string");
    }

    //* Desconstrução de variável em array para facilitar a tipagem que vai receber do banco de dados, e validação para ver o a conta já existe no banco de dados.

    const [userDBExists]: TUserDB[] | undefined[] = await db("users").where({
      id,
    });

    if (userDBExists) {
      res.status(400);
      throw new Error("'id' já existe");
    }

    const newUser = new User(id, name, email, password);

    const newUserDB: TUserDBPost = {
      id: newUser.getId(),
      name: newUser.getName(),
      email: newUser.getEmail(),
      password: newUser.getPassword(),
    };

    await db("users").insert(newUserDB);
    const [userDB]: TUserDB[] = await db("users").where({ id });

    res.status(201).send(userDB);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/accounts", async (req: Request, res: Response) => {
  try {
    //* Variável accountsDB irá ser do tipo TAccountDB e como recebe um valor que vem do banco de dados é um array. Ele irá esperar e receber o valor referente a accounts do db.

    const accountsDB: TAccountDB[] = await db("accounts");

    //* Com os dados recebidos, iremos utilizar a variável criada e tipá-la com a classe Account, como accountsDB está usando o método map, então Account que é uma classe também será atribuido dentro de um array. Mapeando o accountsDB, para cada valor dentro de accountsDB uma nova instancia será criada na classe Account e seus argumentos serão os dados que existem para cara elemento de accountsDB.

    const accounts: Account[] = accountsDB.map(
      (account) =>
        new Account(
          account.id,
          account.balance,
          account.owner_id,
          account.created_at
        )
    );

    //* Se tudo estiver relacionado corretamente, um status 200 de sucesso será enviado juntamente com os valores que accounts recebeu do map de accountsDB.

    res.status(200).send(accounts);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/accounts/:id/balance", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    //* Novamente uma descontrução comparativa de um valor recebido do banco de dados, como o valor vem no formato array, as tipagens dele serão também recebidas dentro de um array, ou em TAccountDB ou indefinido.

    const [accountDB]: TAccountDB[] | undefined[] = await db("accounts").where({
      id,
    });

    if (!accountDB) {
      res.status(404);
      throw new Error("'id' não encontrado");
    }

    const confirmedAccountDB = new Account(
      accountDB.id,
      accountDB.balance,
      accountDB.owner_id,
      accountDB.created_at
    );

    res.status(200).send({ balance: confirmedAccountDB.getBalance() });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/accounts", async (req: Request, res: Response) => {
  try {
    const { id, owner_id } = req.body;

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' deve ser string");
    }

    if (typeof owner_id !== "string") {
      res.status(400);
      throw new Error("'owner_id' deve ser string");
    }

    const [accountDBExists]: TAccountDB[] | undefined[] = await db(
      "accounts"
    ).where({ id });

    if (accountDBExists) {
      res.status(400);
      throw new Error("'id' já existe");
    }
    //*1. fazemos um get do valor que queremos: getOwnerId(): string{return this.ownerId}
    //*2. quando vamos enviar pro código a gente cria uma variável nova: dadosParaOBD = {id: instânciaDaClasse.getId(), owner_id: instânciaDaClasse.ownerId}
    const newAccount = new NewAccount(id, owner_id);

    const newAccountDB = {
      id: newAccount.getId(),
      owner_id: newAccount.getOwnerId(),
    };

    await db("accounts").insert(newAccountDB);

    const [accountDB]: TAccountDB[] = await db("accounts").where({ id });

    res.status(201).send(accountDB);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.put("/accounts/:id/balance", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const value = req.body.value;

    if (typeof value !== "number") {
      res.status(400);
      throw new Error("'value' deve ser number");
    }

    const [accountDB]: TAccountDB[] | undefined[] = await db("accounts").where({
      id,
    });

    if (!accountDB) {
      res.status(404);
      throw new Error("'id' não encontrado");
    }

    const account: Account = new Account(
      accountDB.id,
      accountDB.balance,
      accountDB.owner_id,
      accountDB.created_at
    );

    account.setBalance(value);

    await db("accounts")
      .update({ balance: account })
      .where({ id });

    res.status(200).send(account);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});
