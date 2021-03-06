<?php
//$con = mysqli_connect("localhost", "root", "123456", "wheelchair");
require_once('server_script.php');

session_start();

function showErrors(){
        
  // global can only make it work
  global $error;
  if ($error == "wrong")
  {
      echo "<p id='error_msg' class='small text-danger'>Wrong Username OR Password </p>";
  }
    
}

if (isset($_POST['login'])) {

  $db = new connection;

  $error = $db->authoriseUser(strval($_POST['username']), strval($_POST['password']));
}


/*
if (isset($_POST['login'])) {

  $username = $_POST['username'];
  $password = $_POST['password'];

  $query = "SELECT * FROM admin WHERE username = '$username' AND password = '$password'";

  $query_result = mysqli_query($con, $query);

  if (mysqli_num_rows($query_result) == 1) {

    // login the user
    session_start();

    $_SESSION['id'] = session_id();

    $_SESSION['username'] = $username;

    header("location:prototype.php");

    echo "successfully login";
  } else {

    $error = "wrong";
  }
}

*/

if (isset($_SESSION['id'])) {


  header("location:../index.php");
} else {


?>

<!DOCTYPE html>
<html>

<head>
  <title>Simple Map</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <!-- Bootstrap CDN -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

  <!-- TODO create local fallback -->

  <!-- D3 JS library -->
  <script src="https://d3js.org/d3.v4.min.js"></script>
  

  <!-- custom main ui css -->
  <link rel="stylesheet" href="../css/login-ui.css"/>

</head>

<body>

<!-- Login modal -->
<div class="bg">

<div class="container">
<div class="row justify-content-center align-items-center" style="height:100vh">
    <div class="col-md-8 col-sm-12">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          
          <h2>Login</h2>
          
        </div>
        <div class="modal-body">
          <form action="login.php" method="post">
            <div class="form-group">
              <label for="username" class="col-form-label">Username</label>
              <input type="text" name="username" class="form-control" id="username" />
            </div>
            <div class="form-group">
              <label for="password" class="col-form-label">Password</label>
              <input type="password" name="password" class="form-control" id="password" />
            </div>
            <?php showErrors(); ?>
        </div>
        <div class="modal-footer">
          
          <input type="submit" name="login" class="btn btn-success btn-lg btn-block" value="Login" />
        </div>
        </form>
      </div>
    </div>
</div>
</div>
</div>
</div>


</body>

</html>

<?php

}
?>