<?php
  session_start();
  include 'functions.php';
  include 'constants.php';

  //Creating a connection to the Database
  $pdo = create_pdo();

  //Controll if the user is still logged in
  if (isset($_SESSION['login']) && $_SESSION['login'] == 1) {
    try {

        $post_data = file_get_contents("php://input");
        $post_homework = json_decode($post_data)->{'h'};

      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $pdo->beginTransaction();

      $update_upload_stmt = $pdo->prepare("call get_upload_info_uploads(:homeworkid)");
      $update_upload_stmt->bindParam(':homeworkid', $post_homework);

      $update_upload_stmt->execute();
      $data = $update_upload_stmt->fetchAll();
      $update_upload_stmt->closeCursor();


      $update_upload_buy_stmt = $pdo->prepare("call get_upload_info_buy(:homeworkid, :userid)");
      $update_upload_buy_stmt->bindParam(':homeworkid', $post_homework);
      $update_upload_buy_stmt->bindParam(':userid', $_SESSION['userid']);

      $update_upload_buy_stmt->execute();
      $dataBuy = $update_upload_buy_stmt->fetchAll();
      $update_upload_buy_stmt->closeCursor();

      //Clearing the SQL Array from some thing i dont need
      $workedData = array();
      for ($i=0; $i < count($data); $i++) {
        $workedData[$i]['id'] = intval($data[$i]['idupload']);
        $workedData[$i]['userid'] = intval($data[$i]['user_iduser']);
        $workedData[$i]['respect'] = intval($data[$i]['respect_cost']);
        $workedData[$i]['dollaz'] = floatval($data[$i]['dollaz_cost']);
        $workedData[$i]['timestamp'] = $data[$i]['timestamp'];
        $workedData[$i]['description'] = $data[$i]['description'];
        $workedData[$i]['fileid'] = intval($data[$i]['file_idfile']);
        $workedData[$i]['homeworkid'] = intval($data[$i]['homework_idhomework']);
        $workedData[$i]['respectE'] = intval($data[$i]['respect_earned']);
        $workedData[$i]['dollazE'] = intval($data[$i]['dollaz_earned']);
        $workedData[$i]['bought'] = 0;

        for ($j=0; $j < count($dataBuy) ; $j++) {
            if ($workedData[$i]['id'] == $dataBuy[$j]['upload_idupload']) {
                if ($dataBuy[$j]['user_iduser'] == $_SESSION['userid']) {
                    $workedData[$i]['bought'] = 1;
                }
            }
        }
        if ($workedData[$i]['userid'] == $_SESSION['userid']){
            $workedData[$i]['bought'] = 1;
        }
      }
      //Creating the Success response
      $response = array(
        'response' => SUCCESS,
        'uploads' => $workedData
      );

      $pdo->commit();
    } catch (Exception $e) {
      //Response if there is a SQL Error
      $pdo->rollBack();
      $response = array('response' => SQL_FAIL);
    }
  } else {
    //Response if user is not logged in
    $response = array('response' => NOT_LOGGED_IN);
  }
  echo json_encode($response);
?>
