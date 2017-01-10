<?php
namespace rest\modules\api\controllers;

use Yii;
use rest\modules\api\BaseApiController;

class JurnalharianController extends \rest\modules\api\ActiveController
{
    public $modelClass = 'rest\models\Tjmh';

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['create']);
        unset($actions['index']);
        unset($actions['update']);
        unset($actions['delete']);
        return $actions;
    }

    public function actionIndex(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $date_start = $request->getQueryParam('date_start', false);
        $date_end = $request->getQueryParam('date_end', false);
        $sekolahid = $request->getQueryParam('sekolahid', false);

        $query = $model->find()
                       ->where('1=1')
                       ->orderBy(['tahun_ajaran_id' => SORT_DESC, 'tjmhno' => SORT_DESC])
                       ->asArray();

        if($sekolahid){
            $query->andWhere(['sekolahid' => $sekolahid]);
        }
        if($date_start && $date_end){
            $query->andWhere(['between','tjmhdt', $date_start, $date_end]);
        }
        // var_dump($query->createCommand()->rawSql);exit();
        return $this->prepareDataProvider($query);
    }
    
    public function actionCreate(){
        $post = Yii::$app->getRequest()->getBodyParams();
        if($post){
            return $this->saveAndPosting($post);
        }else{
            $this->response->setStatusCode(400, 'Data is empty.');
            return [
                'message' => 'Data can\'t be empty'
            ];
        }
    }

    public function actionUpdate($id){
        $post = Yii::$app->getRequest()->getBodyParams();
        if($post){
            return $this->saveAndPosting($post);
        }else{
            $this->response->setStatusCode(400, 'Data is empty.');
            return [
                'message' => 'Data can\'t be empty'
            ];
        }
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function saveAndPosting($post){
        $this->response = Yii::$app->getResponse();
        $post = Yii::$app->getRequest()->getBodyParams();
        
        $attrvalue = [];
        $postingvalue = [];
        $flagdelete = [
            'id' => [],
            'mcoadno' => []
        ];
        extract($post);
        $date = date('Y-m-d H:i:s');

        // $_tgl = explode('T', $form['tjmhdt']);
        // $form['tjmhdt'] = $_tgl[0];
        
        $form['sekolahid'] = isset($form['sekolahid']) ? $form['sekolahid'] : 0;
        $TahunAjaran = \rest\models\TahunAjaran::findOne(['aktif' => '1']);
        $form['tahun_ajaran_id'] = isset($form['tahun_ajaran_id']) ? $form['tahun_ajaran_id'] : $TahunAjaran->id;
        $form['created_by'] = (isset($form['created_by']) && !empty($form['created_by'])) ? 
                                $form['created_by'] : \Yii::$app->user->getId();
        $form['updated_by'] = \Yii::$app->user->getId();
        $form['created_at'] = (isset($form['created_at'])  && !empty($form['created_at'])) ? 
                                    $form['created_at'] : $date;
        $form['updated_at'] = $date;

        foreach($grid as $k => $rows){
            $model = new $this->modelClass;
            
            if($rows['flag'] == '1'){
                $attrvalue[] = [
                    'tjmdid'                => isset($rows['tjmdid']) ? $rows['tjmdid'] : '', 
                    'tjmhno'                => isset($form['tjmhno']) ? $form['tjmhno'] : null,
                    'tjmddesc'              => isset($rows['tjmddesc']) ? $rows['tjmddesc'] : null,        
                    'mcoadno'               => isset($rows['mcoadno']) ? $rows['mcoadno'] : null,
                    'debet'                 => isset($rows['debet']) ? $rows['debet'] : 0,
                    'kredit'                => isset($rows['kredit']) ? $rows['kredit'] : 0,
                    'created_at'            => isset($rows['created_at']) ? $rows['created_at'] : $date,   
                    'updated_at'            => $date
                ];

                // If mcoadno is edited
                if(isset($rows['mcoadnoold']) && $rows['mcoadno'] != $rows['mcoadnoold']){
                     $flagdelete['mcoadno'][] = $rows['mcoadnoold'];
                }

                $postingvalue[] = [
                    'rgldt'                => isset($form['tjmhdt']) ? $form['tjmhdt'] : $date, 
                    'mcoadno'              => isset($rows['mcoadno']) ? $rows['mcoadno'] : null,
                    'noref'                => isset($form['tjmhno']) ? $form['tjmhno'] : null,        
                    'noref2'               => isset($form['tjmhno']) ? $form['tjmhno'] : null, 
                    'rglin'                => isset($rows['debet']) ? $rows['debet'] : 0,
                    'rglout'               => isset($rows['kredit']) ? $rows['kredit'] : 0,
                    'rgldesc'             => isset($rows['tjmddesc']) ? $rows['tjmddesc'] : null,
                    'fk_id'               => null,
                    'sekolahid'           => $form['sekolahid'],
                    'tahun_ajaran_id'     => $form['tahun_ajaran_id'],
                    'created_at'     => (isset($form['created_at'])  && !empty($form['created_at'])) ? 
                                            $form['created_at'] : $date,   
                    'updated_at'     => $date,
                    'created_by'     => (isset($form['created_by']) && !empty($form['created_by'])) ? 
                                            $form['created_by'] : \Yii::$app->user->getId(),   
                    'updated_by'     => \Yii::$app->user->getId()
                ];
            }else if($rows['flag'] == '0'){
                $flagdelete['id'][] = isset($rows['tjmdid']) ? $rows['tjmdid'] : '';
                $flagdelete['mcoadno'][] = isset($rows['mcoadno']) ? $rows['mcoadno'] : '';
            }
        }

        $result = $model->saveAndPosting([
            'rowHeader' => $form,
            'rowDetail' => $attrvalue,
            'rowDetailDel' => $flagdelete,
            'postingvalue' => $postingvalue
        ]);
        
        if($result !== true){
            $this->response->setStatusCode(422, 'Data Validation Failed.');
        }else{
            $this->response->setStatusCode(201, 'Created.');
        }
        return $result;
    }

    public function actionDelete($id){
        $this->response = Yii::$app->getResponse();
        if(isset($id) && !empty($id) && $id != 'undefined'){
            $model = new $this->modelClass;
            $result = $model->deleteAndRemoveAll($id);
            if($result !== true){
                $this->response->setStatusCode(422, 'Data Validation Failed.');
            }else{
                // $this->response->setStatusCode(200, 'Created.');
            }
            return $result;
        }else{
            $this->response->setStatusCode(400, 'Data is empty.');
            return [
                'message' => 'No Kwitansi can\'t be empty'
            ];
        }
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionNewnotransaksi(){
        $model = new $this->modelClass();
        $request = Yii::$app->getRequest();
        $sekolahid = $request->getQueryParam('sekolahid', 0);
        return $model->getNewNOKwitansi(date('y'), $sekolahid);
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionFindbyno(){
        $model = new \rest\models\Tjmd();
        $request = Yii::$app->getRequest();
        return $model->findByNo([
            'query' => $request->getQueryParam('query', false),
            'tjmhno' => $request->getQueryParam('tjmhno', '')
        ]);
    }
}