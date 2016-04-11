<?php
$dir = "images"; 
if(isset($_GET['file'])&&$_GET['file'])
{
	$dir = $_GET['file'];
}
$dirArray = explode('|',$dir);
foreach($dirArray as $key=>$value)
{
	$dirArray[$key] = $value;
}

// Open a known directory, and proceed to read its contents

function find_all_files($dir,&$array)
{
	if (is_dir($dir)) 
	{
		if ($dh = opendir($dir))
		{
			$i=0;
			$curPath = "";
			$curId = "";
			while (($file = readdir($dh)) !== false) 
			{
				if ($file!="." && $file!=".." && $file != '.svn'&&$file!='preload') 
				{
					if(is_dir( $dir.'/'.$file ))
					{
						find_all_files($dir.'/'.$file,$array);
					}
					else
					{
						$curPath = $dir.'/'.$file;
						$curId = explode(".",$file);
						$curId = $curId[0];
						$curPathArr = array('src'=>$curPath,'id'=>$curId);
						// $curPathArr = $curPath;
						array_push($array,$curPathArr);
						//$result[$i] = $dir.'/'.$file;
					}
					$i++;
				}
			}
			closedir($dh);
		}
	}
}
$result = array();
foreach($dirArray as $value)
{
	find_all_files($value,$result);
}


header("Content-type: application/json");
echo json_encode($result);

?> 