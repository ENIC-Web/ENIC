<?php
session_start();
session_destroy();
header('Location: ../application.html');
exit; 