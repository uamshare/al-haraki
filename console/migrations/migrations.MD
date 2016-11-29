yii migrate/create add_spp_bulan_column_to_kwitansi_pembayaran_h_table --fields="spp_bulan:string(100)"

yii migrate/create alter_bulan_column_to_kwitansi_pembayaran_h_table --fields="bulan:string(35)"

yii migrate/create add_tgl_ref_column_to_tagihan_pembayaran_table --fields="tgl_ref:date"

yii migrate/create create_opt_months_table --fields="month:integer,order:integer"