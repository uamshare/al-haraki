<?php
namespace rest\modules\api;

use Yii;
// use yii\base\Arrayable;
// use yii\base\Component;
// use yii\base\Model;
// use yii\data\DataProviderInterface;
// use yii\data\Pagination;
use yii\helpers\ArrayHelper;
// use yii\web\Link;
// use yii\web\Request;
use yii\web\Response;

class Serializer extends \yii\rest\Serializer
{   

    /**
     * @override
     */
    protected function serializeModel($model)
    {
        if ($this->request->getIsHead()) {
            return null;
        } else {
            list ($fields, $expand) = $this->getRequestedFields();
            return $this->formatResponse($model->toArray($fields, $expand),1); //$model->toArray($fields, $expand);
        }
    }

    /**
     * @override
     */
    protected function serializeModelErrors($model)
    {
        $this->response->setStatusCode(422, 'Data Validation Failed.');
        $result = [];
        foreach ($model->getFirstErrors() as $name => $message) {
            $result[] = [
                'field' => $name,
                'message' => $message,
            ];
        }
        return $result;
    }

    /**
     * @override
     */
    protected function serializeModels(array $models)
    {
        list ($fields, $expand) = $this->getRequestedFields();
        foreach ($models as $i => $model) {
            if ($model instanceof Arrayable) {
                $models[$i] = $model->toArray($fields, $expand);
            } elseif (is_array($model)) {
                $models[$i] = ArrayHelper::toArray($model);
            }
        }

        return $this->formatResponse($models); //$models;
    }

    private function formatResponse(array $models, $count = 0){
        return [
            'success' => true,   
            'total' => ($count > 0) ? $count : count($models), //$header['x-pagination-total-count'],
            'rows' => $models
        ];

        // var_dump($models);
    }
}
