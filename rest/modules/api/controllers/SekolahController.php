<?php
namespace rest\modules\api\controllers;
use Yii;
use yii\web\ServerErrorHttpException;
// use yii\data\ActiveDataProvider;

class SekolahController extends \rest\modules\api\ActiveController // \yii\rest\ActiveController
{
    public $modelClass = 'rest\models\Sekolah';

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['create']);
        // // unset($actions['delete']);
        unset($actions['update']);
        // unset($actions['index']);
        // unset($actions['view']);
        return $actions;
    }

    /**
     * Get List input Info Tagihan
     *
     */
    public function actionCreate(){
        $post = Yii::$app->getRequest()->getBodyParams();
        if($post){
            return $this->save($post);
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
            return $this->save($post);
        }else{
            $this->response->setStatusCode(400, 'Data is empty.');
            return [
                'message' => 'Data can\'t be empty'
            ];
        }
    }

    private function save($post){
        $model = $this->modelClass;
        extract($post);
        $sekolahIsSave = true;

        if($form){
            $tahunAjaran = \rest\models\TahunAjaran::updateAll(['aktif' => '0'], ['<>', 'id', $form['tahun_ajaran_id']]);
            // var_dump($tahunAjaran->createCommand()->rawQuery);exit();
            $tahunAjaran = \rest\models\TahunAjaran::updateAll(['aktif' => '1'], ['=', 'id', $form['tahun_ajaran_id']]);
        }

        if($grid){
            
            foreach($grid as $row){
                if(is_array($row)){
                    if($row['flag'] == '0'){
                        $model::deleteAll(['id' => $row['id']]);
                    }else if($row['flag'] == '1'){
                        $m = isset($row['id']) ? $model::findOne($row['id']) : new $this->modelClass; 
                        if(!$m){
                            $m = new $this->modelClass;
                        }
                        $m->load($row, '');
                        if (!$m->save()) {
                            $sekolahIsSave = false;
                        }
                    }
                }
            }
        }

        if ($sekolahIsSave) {
            $response = Yii::$app->getResponse();
            $response->setStatusCode(201);
            // $id = implode(',', array_values($model->getPrimaryKey(true)));
            // $response->getHeaders()->set('Location', Url::toRoute([$this->viewAction, 'id' => $id], true));
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Failed to create the object for unknown reason.');
        } else {
            $this->response->setStatusCode(401, 'Validation failed.');
            return $model->hasErrors();
        }

        return true;
    }

    public function actionProfile($id){
        $model = $this->modelClass;
        $userProfile = \yii::$app->user->identity->profile;

        // $model = $model::find(['id' => $id])->one();
        $request = Yii::$app->getRequest();

        return $model::getProfile($id);
    }
}