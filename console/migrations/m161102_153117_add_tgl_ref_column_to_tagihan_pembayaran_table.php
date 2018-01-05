<?php

use yii\db\Migration;

/**
 * Handles adding tgl_ref to table `tagihan_pembayaran`.
 */
class m161102_153117_add_tgl_ref_column_to_tagihan_pembayaran_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->addColumn('tagihan_pembayaran', 'tgl_ref', $this->date());
        $this->createIndex('idx_UNIQUE_idrombel_4631_53','tagihan_pembayaran',['idrombel','no_ref','bulan'],1);
        $this->dropIndex('idrombel_2','tagihan_pembayaran');
        // Set Value to tgl_ref
        $this->execute("UPDATE tagihan_pembayaran p,
            (SELECT p.`no_ref`,
                (CASE
                    WHEN SUBSTR(no_ref,1,2) = '01' THEN kw.`tgl_kwitansi`
                    WHEN SUBSTR(no_ref,1,2) = '03' THEN ad.`tgl_transaksi`
                END) AS tgl_ref
            FROM tagihan_pembayaran p
            LEFT JOIN kwitansi_pembayaran_h kw ON p.`no_ref` = kw.`no_kwitansi`
            LEFT JOIN tagihan_autodebet_h ad ON p.`no_ref`= ad.`no_transaksi`
            WHERE p.`no_ref` NOT LIKE 't_info%') AS a
            SET p.tgl_ref = a.tgl_ref
            WHERE p.no_ref = a.no_ref");
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        $this->dropColumn('tagihan_pembayaran', 'tgl_ref');
        $this->dropIndex('idx_UNIQUE_idrombel_4631_53','tagihan_pembayaran');
    }
}
