<?php
session_start();
?>
<!DOCTYPE html>
<html>
<head>
</head>
<body>
    

<?php   
    function connexion_bd(){
        define('USER',"root");
        define('PASSWD',"");
        define('SERVER',"localhost:3306");
        define('BASE',"project_marketplace");
    
        $dsn="mysql:dbname=".BASE.";host=".SERVER;
        try{
            $connexion=new PDO($dsn,USER,PASSWD);
        }
        catch(PDOException $e){
            printf("Échec de la connexion : %s\n", $e->getMessage());
            exit();
        }
        return $connexion;
    }
?>


</body>
</html>
