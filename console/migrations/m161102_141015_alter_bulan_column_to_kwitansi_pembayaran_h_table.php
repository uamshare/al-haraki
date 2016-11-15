<?php

use yii\db\Migration;

class m161102_141015_alter_bulan_column_to_kwitansi_pembayaran_h_table extends Migration
{
    public function safeUp()
    {
        $this->alterColumn('kwitansi_pembayaran_h', 'bulan', $this->string(35));
    }

    public function safeDown()
    {
        $this->alterColumn('kwitansi_pembayaran_h', 'bulan', $this->integer());
    }
}
