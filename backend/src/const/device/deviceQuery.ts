export class DeviceQuery {
  static findAll = `SELECT device.*, company.Name CompanyName, company.NormalizedName CompanyNormalizedName
                    FROM device JOIN company
                    ON device.CompanyId = company.CompanyId
                    WHERE device.IsDeleted = false`;

  static findById = `SELECT device.*, company.Name CompanyName, company.NormalizedName CompanyNormalizedName
                     FROM device JOIN company
                     ON device.CompanyId = company.CompanyId
                     WHERE device.IsDeleted = false
                     AND DeviceId = ?`;

  static findByName = `SELECT * FROM device 
                       WHERE NormalizedName = ? 
                       AND IsDeleted = false`;

  static findByNameAndId = `SELECT * FROM device 
                            WHERE NormalizedName = ?
                            AND DeviceId != ? 
                            AND IsDeleted = false`;

  static create = `INSERT INTO device 
                   (CompanyId, Name, NormalizedName, APIKey, CreatedBy, CreatedOn) 
                   VALUES (?, ?, ?, ?, ?, ?)`;

  static update = `UPDATE device SET 
                   Name = ?, NormalizedName = ?, APIKey = ?, 
                   UpdatedBy = ?, UpdatedOn = ? 
                   WHERE DeviceId = ? AND IsDeleted = false`;

  static delete = `UPDATE device SET 
                   IsDeleted = true, UpdatedBy = ?, UpdatedOn = ? 
                   WHERE DeviceId = ? AND IsDeleted = false`;

  static createHistory = `INSERT INTO device_history 
                          (DeviceId, CompanyId, Name, NormalizedName, APIKey, IsDeleted, 
                          CreatedBy, CreatedOn, UpdatedBy, UpdatedOn) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
}
