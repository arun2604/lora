import { Service } from "typedi";
import dotenv from "dotenv";
import mysql, { QueryError, ResultSetHeader, RowDataPacket } from "mysql2";
import { IDatabaseManager } from "../context/database/databaseManager";
import { AppLogger } from "../logger";
import { Logger } from "winston";
import convertPascalToCamelCase from "../utilities/appUtils";

dotenv.config();

@Service(IDatabaseManager.identity)
export class DatabaseManagerImpl extends IDatabaseManager {
  logger: Logger = AppLogger.getInstance().getLogger(__filename);
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    timezone: "Z",
  });

  getConnection(): void {
    this.logger.info(`Method : ${this.getConnection.name}`);
    this.connection.connect((err) => {
      if (err) {
        this.logger.info(`Database Connection ${err}`);
        return;
      }
      this.logger.info("Connected to MySQL Database");
    });
  }

  executeGetQuery<ReturnType = RowDataPacket>(query: string, values?: any[]): Promise<ReturnType[]> {
    this.logger.info(`Method : ${this.executeGetQuery.name}`);
    return new Promise<ReturnType[]>((resolve, reject) => {
      this.connection.query(query, values, (error: QueryError | null, results: RowDataPacket[]) => {
        if (error) {
          this.logger.error(`DB ${error}`);
          return reject(`DB ${error}`);
        }
        const result = convertPascalToCamelCase(results) as ReturnType[];
        resolve(result);
      });
    });
  }

  executeRunQuery(query: string, values?: any[]): Promise<ResultSetHeader> {
    this.logger.info(`Method : ${this.executeRunQuery.name}`);
    return new Promise<ResultSetHeader>((resolve, reject) => {
      this.connection.query(query, values, (error: QueryError | null, results: ResultSetHeader) => {
        if (error) {
          this.logger.error(`DB ${error}`);
          return reject(`DB ${error}`);
        }
        resolve(results);
      });
    });
  }

  async executeStartTransactionQuery(): Promise<void> {
    const query = "START TRANSACTION";
    this.logger.info(`Start transaction query : ${query}`);
    await this.executeRunQuery(query);
  }

  async executeCommitQuery(): Promise<void> {
    const query = "COMMIT";
    this.logger.info(`Commit query : ${query}`);
    this.executeRunQuery(query);
  }

  async executeRollBackQuery(): Promise<void> {
    const query = "ROLLBACK";
    this.logger.info(`Rollback query : ${query}`);
    this.executeRunQuery(query);
  }
}
