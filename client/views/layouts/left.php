<aside class="main-sidebar">

    <section class="sidebar">

        <!-- Sidebar user panel -->
        <div class="user-panel">
            <div class="pull-left image">
                <img src="<?= $directoryAsset ?>/img/user2-160x160.jpg" class="img-circle" alt="User Image"/>
            </div>
            <div class="pull-left info">
                <p>Alexander Pierce</p>

                <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
            </div>
        </div>

        <!-- search form -->
        <form action="#" method="get" class="sidebar-form">
            <div class="input-group">
                <input type="text" name="q" class="form-control" placeholder="Search..."/>
              <span class="input-group-btn">
                <button type='submit' name='search' id='search-btn' class="btn btn-flat"><i class="fa fa-search"></i>
                </button>
              </span>
            </div>
        </form>
        <!-- /.search form -->

        <?= dmstr\widgets\Menu::widget(
            [
                'options' => ['class' => 'sidebar-menu'],
                'items' => [
                    // ['label' => 'Menu Yii2', 'options' => ['class' => 'header']],
                    [
                        'label' => 'MASTER DATA',
                        'icon' => 'fa fa-database',
                        'url' => '$',
                        'items' => [
                            ['label' => 'Data Siswa', 'icon' => 'fa fa-user-plus', 'url' => ['/#master/siswa']],
                            ['label' => 'Data Karyawan', 'icon' => 'fa fa-user-plus', 'url' => ['/#master/karyawan']],
                            ['label' => 'Kelas', 'icon' => 'fa fa-user-plus', 'url' => ['#master/kelas']]
                        ],
                    ],
                    [
                        'label' => 'KEUANGAN',
                        'icon' => 'fa fa-cc-visa',
                        'url' => '$',
                        'items' => [
                            ['label' => 'Info Tagihan', 'icon' => 'fa fa-user-plus', 'url' => ['/#keuangan/info-tagihan']],
                            ['label' => 'Kwitansi Pembayaran', 'icon' => 'fa fa-user-plus', 'url' => ['#keuangan/kwitansi-pembayaran']],
                            ['label' => 'Rekap Pembayaran Tagihan', 'icon' => 'fa fa-user-plus', 'url' => ['/#keuangan/rekap-pembayaran-tagihan']],
                            ['label' => 'Rekap Outstanding Tagihan', 'icon' => 'fa fa-user-plus', 'url' => ['/#keuangan/rekap-outstanding-tagihan']],
                            ['label' => 'Pengeluaran', 'icon' => 'fa fa-user-plus', 'url' => ['#keuangan/pengeluaran']],
                            ['label' => 'Kwitansi Pengeluaran', 'icon' => 'fa fa-user-plus', 'url' => ['/#keuangan/kwitansi-pengeluaran']],
                            ['label' => 'Rekap Pengeluaran', 'icon' => 'fa fa-user-plus', 'url' => ['/#keuangan/rekap-pengeluaran']],
                            ['label' => 'Rekonsiliasi Autodebet', 'icon' => 'fa fa-user-plus', 'url' => ['#keuangan/rekonsiliasi-autodebet']]
                        ],
                    ],
                    [
                        'label' => 'AKUNTANSI',
                        'icon' => 'fa fa-pie-chart',
                        'url' => '$',
                        'items' => [
                            ['label' => 'Master Akun (Chart of Acount)', 'icon' => 'fa fa-user-plus', 'url' => ['/#akuntansi/coa']],
                            ['label' => 'Pemetaan Posting Otomatis', 'icon' => 'fa fa-user-plus', 'url' => ['/#akuntansi/pemetaan']],
                            ['label' => 'Jurnal Harian', 'icon' => 'fa fa-user-plus', 'url' => ['#akuntansi/jurnal-harian']],
                            ['label' => 'Buku Besar (Ledger)', 'icon' => 'fa fa-user-plus', 'url' => ['/#akuntansi/gl']]
                        ],
                    ],
                    [
                        'label' => 'PENGATURAN',
                        'icon' => 'fa fa-cogs   ',
                        'url' => '$',
                        'items' => [
                            ['label' => 'Pengguna', 'icon' => 'fa fa-user', 'url' => ['/#pengaturan/pengguna']],
                            ['label' => 'Grup Akses Pengguna', 'icon' => 'fa fa-users', 'url' => ['/#pengaturan/grup-akses-pengguna']],
                            ['label' => 'Sekolah', 'icon' => 'fa fa-user-plus', 'url' => ['#pengaturan/sekolah']]
                        ],
                    ],
                    [
                        'label' => 'Yii tools',
                        'icon' => 'fa fa-share',
                        'url' => '$',
                        'items' => [
                            ['label' => 'Gii', 'icon' => 'fa fa-file-code-o', 'url' => ['/gii'],],
                            ['label' => 'Debug', 'icon' => 'fa fa-dashboard', 'url' => ['/debug'],],
                            [
                                'label' => 'Level One',
                                'icon' => 'fa fa-circle-o',
                                'url' => '#',
                                'items' => [
                                    ['label' => 'Level Two', 'icon' => 'fa fa-circle-o', 'url' => '#',],
                                    [
                                        'label' => 'Level Two',
                                        'icon' => 'fa fa-circle-o',
                                        'url' => '#',
                                        'items' => [
                                            ['label' => 'Level Three', 'icon' => 'fa fa-circle-o', 'url' => '#',],
                                            ['label' => 'Level Three', 'icon' => 'fa fa-circle-o', 'url' => '#',],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ]
        ) ?>

    </section>

</aside>
