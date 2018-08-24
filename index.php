<?php
echo "Here are our files";
$path = "/Users/alvin/Documents/GitHub/a-hartono.github.io";
$dh = opendir($path);
$i=1;
while (($file = readdir($dh)) !== false) {
    if($file != "/Users/alvin/Documents/GitHub/a-hartono.github.io" && $file != ".." && $file != "index.php" && $file != ".htaccess" && $file != "error_log" && $file != "cgi-bin") {
        echo "<a href='$path/$file'>$file</a><br /><br />";
        $i++;
    }
}
closedir($dh);
?> 
