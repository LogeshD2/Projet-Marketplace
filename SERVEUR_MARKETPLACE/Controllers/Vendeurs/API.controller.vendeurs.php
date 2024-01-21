<?php

require_once "Models/Vendeurs/API.model.vendeurs.php";
require_once "Models/Model.php";


class APIControllerVendeurs {

    private $apiVendeurManager;
    
    public function __construct()
    {
        $this->apiVendeurManager = new APIModelVendeur();
    }

    public function getVendeur($token) {
        $vendeur = $this->apiVendeurManager->getDBVendeur($token);
        Model::sendJSON($this->formatDataVendeur($vendeur));
    }

    public function formatDataVendeur($vendeurs) {
        $tab=[
                'user'=>json_decode($vendeurs[0]),
                'treasury'=>json_decode($vendeurs[1]),
                'products'=>json_decode($vendeurs[2]),
                'Category'=>json_decode($vendeurs[3]),
                'sold'=>json_decode($vendeurs[3]),
                'contract'=>json_decode($vendeurs[4]),
                'category'=>json_decode($vendeurs[5])
        ];
        return $tab;
    }
}