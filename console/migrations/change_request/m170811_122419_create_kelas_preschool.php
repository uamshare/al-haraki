<?php

use yii\db\Migration;

class m170811_122419_create_kelas_preschool extends Migration
{
    public function safeUp()
    {
        $tables = Yii::$app->db->schema->getTableNames();
        $dbType = $this->db->driverName;

        if (in_array('sekolah', $tables))  { 
            if ($dbType == "mysql") {
                $this->execute("alter table sekolah change column 
                                    tingkatan tingkatan enum('PRESCHOOL','SD','SMP','SMA') default null");
                $this->execute("update sekolah set nama='PRESCHOOL',tingkatan='PRESCHOOL' where id=3");
            }
        }

        if (in_array('kelas', $tables))  { 
            if ($dbType == "mysql") {
                $this->execute("ALTER TABLE kelas add column group_kelas varchar(50) after kelas");
                $this->execute("update kelas set kelas = 0, sekolahid = 3, group_kelas = 'TPA' where id in(36,37)");
                $this->execute("insert into kelas (kelas, group_kelas, nama_kelas, sekolahid) values
                                    (0,'Daycare','Daycare',3),
                                    (0,'KB','KB A',3),
                                    (0,'KB','KB B',3),
                                    (0,'TKIT','TKIT Kelas A',3),
                                    (0,'TKIT','TKIT Kelas B',3)");
            }
        }
    }

    public function safeDown()
    {
        if (in_array('kelas', $tables))  { 
            if ($dbType == "mysql") {
                $this->execute("update kelas set kelas = 1, sekolahid = 1 where id in(36,37)");
                $this->execute("delete from kelas where sekolahid =3");
                $this->execute("alter table kelas drop column group_kelas");
            }
        }

        if (in_array('kelas', $tables))  { 
            if ($dbType == "mysql") {
                $this->execute("update sekolah set nama='TPA AL Haraki',tingkatan='SD' where id=3");
                $this->execute("alter table sekolah change column 
                                    tingkatan tingkatan enum('SD','SMP','SMA') default null");
            }
        }

    }

    /*
    // Use safeUp/safeDown to run migration code within a transaction
    public function safeUp()
    {
    }

    public function safeDown()
    {
    }
    */
}
