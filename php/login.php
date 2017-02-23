<?php
  session_start();
  include 'functions.php';
  include 'constants.php';

  $pdo = create_pdo();

  try {
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->beginTransaction();

    $post_data = file_get_contents("php://input");
    $post_username = json_decode($post_data)->{'u'};
    $post_password = json_decode($post_data)->{'pw'};


    $get_user_stmt = $pdo->prepare("call get_user_username(:username)");
    $get_user_stmt->bindParam(':username', $post_username);

    $get_user_stmt->execute();
    $userdata = $get_user_stmt->fetch();

    $get_user_stmt->closeCursor();

    if ($userdata['iduser'] != "" && password_verify($post_password, $userdata['password'])) {
      $session_id = session_id();
      if (isset($userdata['session_id']) && $userdata['session_id'] != $session_id) {
        session_id($userdata['session_id']);
        logout_user();
        session_id($session_id);
      }
      $_SESSION['userid'] = $userdata['iduser'];
      $_SESSION['login'] = 1;
      $update_user_stmt = $pdo->prepare("call update_user_session_id(:id_in, :session_id_in)");
      $update_user_stmt->bindParam(':id_in', $userdata['iduser']);
      $update_user_stmt->bindParam(':session_id_in', $session_id);

      $update_user_stmt->execute();
      $update_user_stmt->closeCursor();
      $data = array('response' => SUCCESS);
    } else {
      $data = array('response' => FAIL);
    }

    $pdo->commit();
    //YAY hat geklappt
  } catch (Exception $e) {
    $pdo->rollBack();
    $data = array('response' => SQL_FAIL);
  }
  echo json_encode($data);
  return json_encode($data);
?>
