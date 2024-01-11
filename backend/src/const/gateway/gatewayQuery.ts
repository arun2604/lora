export class GatewayQuery {
  static findAll = `SELECT gateway.*, company.Name companyName, company.NormalizedName companyNormalizedName
                    FROM gateway JOIN company
                    ON gateway.CompanyId = company.CompanyId
                    WHERE gateway.IsDeleted = false`;

  static findById = `SELECT gateway.*, company.Name CompanyName, company.NormalizedName CompanyNormalizedName
                     FROM gateway JOIN company
                     ON gateway.CompanyId = company.CompanyId
                     WHERE gateway.IsDeleted = false
                     AND GatewayId = ?`;

  static findByName = `SELECT * FROM gateway 
                       WHERE NormalizedName = ? 
                       AND IsDeleted = false`;

  static findByNameAndId = `SELECT * FROM gateway 
                            WHERE NormalizedName = ?
                            AND GatewayId != ? 
                            AND IsDeleted = false`;

  static create = `INSERT INTO gateway 
                   (CompanyId, Name, NormalizedName, URL, CreatedBy, CreatedOn) 
                   VALUES (?, ?, ?, ?, ?, ?)`;

  static update = `UPDATE gateway SET 
                   Name = ?, NormalizedName = ?, URL = ?, 
                   UpdatedBy = ?, UpdatedOn = ? 
                   WHERE GatewayId = ? AND IsDeleted = false`;

  static delete = `UPDATE gateway SET 
                   IsDeleted = true, UpdatedBy = ?, UpdatedOn = ? 
                   WHERE GatewayId = ? AND IsDeleted = false`;

  static createHistory = `INSERT INTO gateway_history 
                          (GatewayId, CompanyId, Name, NormalizedName, URL, IsDeleted, 
                          CreatedBy, CreatedOn, UpdatedBy, UpdatedOn) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
}
