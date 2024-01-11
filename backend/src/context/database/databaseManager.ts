import { ResultSetHeader, RowDataPacket } from "mysql2";

export abstract class IDatabaseManager {
  static identity: string = "IDatabaseManager";

  abstract getConnection(): void;
  abstract executeGetQuery<ReturnType = RowDataPacket>(query: string, values?: any[]): Promise<ReturnType[]>;
  abstract executeRunQuery(query: string, values?: any[]): Promise<ResultSetHeader>;
  abstract executeStartTransactionQuery(): Promise<void>;
  abstract executeCommitQuery(): Promise<void>;
  abstract executeRollBackQuery(): Promise<void>;
}
