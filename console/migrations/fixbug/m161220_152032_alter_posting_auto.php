<?php

use yii\db\Migration;

class m161220_152032_alter_posting_auto extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $tables = Yii::$app->db->schema->getTableNames();
        $dbType = $this->db->driverName;

        if (in_array('posting_auto', $tables))  { 
            if ($dbType == "mysql") {
                $this->execute("UPDATE posting_auto SET acc_debet='110106' WHERE id=18");
                $this->execute("UPDATE rgl a, kwitansi_pembayaran_h b
                                    SET mcoadno = '110106' WHERE a.`noref` = b.`no_kwitansi` 
                                    AND b.`sumber_kwitansi` = 0 AND a.`mcoadno`='110105'");
            }
        }
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        $tables = Yii::$app->db->schema->getTableNames();
        $dbType = $this->db->driverName;

        if (in_array('posting_auto', $tables))  { 
            if ($dbType == "mysql") {
                $this->execute("UPDATE posting_auto SET acc_debet='110105' WHERE id=18");
                $this->execute("UPDATE rgl a, kwitansi_pembayaran_h b
                                    SET mcoadno = '110105' WHERE a.`noref` = b.`no_kwitansi` 
                                    AND b.`sumber_kwitansi` = 0 AND a.`mcoadno`='110106'");
            }
        }
    }

}
