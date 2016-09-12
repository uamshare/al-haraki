<aside class="main-sidebar" ng-controller="NavbarController">

    <section class="sidebar">

        <!-- Sidebar user panel -->
        <div class="user-panel">
            <div class="pull-left image">
                <img ng-src="{{profil.avatar}}" class="img-circle" alt="User Image"/>
            </div>
            <div class="pull-left info">
                <p>{{profil.fullname}}</p>
                <a href="#"><i class="fa fa-circle text-success"></i> {{profil.jabatan}}</a>
            </div>
        </div>

        <!-- search form -->
        <!-- <form action="#" method="get" class="sidebar-form">
            <div class="input-group">
                <input type="text" name="q" class="form-control" placeholder="Search..."/>
              <span class="input-group-btn">
                <button type='submit' name='search' id='search-btn' class="btn btn-flat"><i class="fa fa-search"></i>
                </button>
              </span>
            </div>
        </form> -->
        <!-- /.search form -->

        <?php 
            echo dmstr\widgets\Menu::widget(
                [
                    'options' => ['class' => 'sidebar-menu'],
                    'items' => [
                        // ['label' => 'Menu Yii2', 'options' => ['class' => 'header']],
                        [
                            'label' => 'MASTER DATA',
                            'icon' => 'fa fa-database',
                            'url' => '$',
                            'options' => ['ng-show' => 'menuprivileges.master'],
                            'items' => [
                                [
                                    'label' => 'Data Siswa', 'icon' => 'fa fa-user-plus', 
                                    'options' => ['ng-show' => 'menuprivileges.siswa'],
                                    'url' => ['/#master/siswa']
                                ],
                                ['label' => 'Data Karyawan', 'icon' => 'fa fa-user-plus', 'options' => ['ng-show' => 'menuprivileges.kelas'],'url' => ['/#master/karyawan']],
                                ['label' => 'Kelas', 'icon' => 'fa fa-user-plus', 'options' => ['ng-show' => 'menuprivileges.pegawai'],'url' => ['#master/kelas']]
                            ],
                        ],
                        [
                            'label' => 'KEUANGAN',
                            'icon' => 'fa fa-cc-visa',
                            'options' => ['ng-show' => 'menuprivileges.keuangan'],
                            'url' => '$',
                            'items' => [
                                ['label' => 'Info Tagihan', 'icon' => 'fa fa-info-circle', 'options' => ['ng-show' => 'menuprivileges.tagihaninfoinput'],'url' => ['/#keuangan/info-tagihan']],
                                ['label' => 'Kwitansi Pembayaran', 'icon' => 'fa fa-edit', 'options' => ['ng-show' => 'menuprivileges.kwitansipembayaran_create'], 'url' => ['#keuangan/kwitansi-pembayaran/add']],
                                ['label' => 'Rekap Pembayaran Tagihan', 'icon' => 'fa fa-print', 'options' => ['ng-show' => 'menuprivileges.tagihanpembayaran_listbayar'], 'url' => ['/#keuangan/rekap-pembayaran-tagihan']],
                                ['label' => 'Rekap Outstanding Tagihan', 'icon' => 'fa fa-print', 'options' => ['ng-show' => 'menuprivileges.tagihaninfoinput_list'],'url' => ['/#keuangan/rekap-outstanding-tagihan']],
                                ['label' => 'Kwitansi Pengeluaran', 'icon' => 'fa fa-edit', 'options' => ['ng-show' => 'menuprivileges.kwitansipengeluaran_create'],'url' => ['/#keuangan/kwitansi-pengeluaran/add']],
                                ['label' => 'Rekap Pengeluaran', 'icon' => 'fa fa-print', 'options' => ['ng-show' => 'menuprivileges.kwitansipengeluaran'], 'url' => ['/#keuangan/kwitansi-pengeluaran']],
                                ['label' => 'Rekonsiliasi Autodebet', 'icon' => 'fa fa-cc-mastercard', 'options' => ['ng-show' => 'menuprivileges.tagihanautodebet'], 'url' => ['#keuangan/rekonsiliasi-autodebet/add']]
                            ],
                        ],
                        [
                            'label' => 'AKUNTANSI',
                            'icon' => 'fa fa-pie-chart',
                            'options' => ['ng-show' => 'menuprivileges.akuntansi'],
                            'url' => '$',
                            'items' => [
                                ['label' => 'Master Akun (Chart of Account)', 'icon' => 'fa fa-user-plus', 'options' => ['ng-show' => 'menuprivileges.mcoad'],'url' => ['/#akuntansi/coa']],
                                // ['label' => 'Pemetaan Posting Otomatis', 'icon' => 'fa fa-user-plus', 'options' => ['ng-show' => 'menuprivileges.postingmap'], 'url' => ['/#akuntansi/pemetaan']],
                                ['label' => 'Jurnal Harian', 'icon' => 'fa fa-table', 'options' => ['ng-show' => 'menuprivileges.jurnalharian'], 'url' => ['#akuntansi/jurnal-harian/add']],
                                ['label' => 'Buku Besar (Ledger)', 'icon' => 'fa fa-print', 'options' => ['ng-show' => 'menuprivileges.rgl'], 'url' => ['/#akuntansi/rgl']]
                            ],
                        ],
                        [
                            'label' => 'PENGATURAN',
                            'icon' => 'fa fa-cogs   ',
                            'options' => ['ng-show' => 'menuprivileges.pengaturan'],
                            'url' => '$',
                            'items' => [
                                ['label' => 'Pengguna', 'icon' => 'fa fa-user', 'options' => ['ng-show' => 'menuprivileges.user'], 'url' => ['/#pengaturan/user']],
                                ['label' => 'Grup Akses Pengguna', 'icon' => 'fa fa-users', 'options' => ['ng-show' => 'menuprivileges.role'], 'url' => ['/#pengaturan/grup-akses']],
                                ['label' => 'Sekolah', 'icon' => 'fa fa-user-plus', 'options' => ['ng-show' => 'menuprivileges.sekolah'], 
                                    'url' => ['#pengaturan/sekolah']]
                            ],
                        ]
                    ],
                ]
            ); 
        ?>

    </section>

</aside>
