# Ubuntu LAMP + phpMyAdmin Setup Guide

This guide walks through setting up a **LAMP stack** (Linux, Apache, MySQL, PHP) on Ubuntu, followed by **phpMyAdmin**.

It is written for a **local development or homelab server** using Apache and MySQL on the same machine.

---

## Part 1 — LAMP Stack Setup

### 1. Update the system

```bash
sudo apt update && sudo apt upgrade -y
```

---

### 2. Install Apache

```bash
sudo apt install apache2 -y
```

Verify Apache is running:

```bash
sudo systemctl status apache2
```

Test in a browser:

```
http://localhost
```

---

### 3. Install MySQL

```bash
sudo apt install mysql-server -y
```

Verify MySQL:

```bash
sudo systemctl status mysql
```

Log in as root (Ubuntu default uses socket auth):

```bash
sudo mysql
```

Exit:

```sql
EXIT;
```

---

### 4. Install PHP and required modules

```bash
sudo apt install php libapache2-mod-php php-mysql -y
```

Verify PHP:

```bash
php -v
```

---

### 5. (Optional) Fix Apache ServerName warning

Edit Apache config:

```bash
sudo nano /etc/apache2/apache2.conf
```

Add at the bottom:

```apache
ServerName localhost
```

Reload Apache:

```bash
sudo systemctl reload apache2
```

---

### 6. Test PHP with Apache

Create a test file:

```bash
sudo nano /var/www/html/info.php
```

```php
<?php phpinfo(); ?>
```

Visit:

```
http://localhost/info.php
```

Delete it afterward:

```bash
sudo rm /var/www/html/info.php
```

---

## Part 2 — phpMyAdmin (Primary / Automatic Setup)

### 1. Install phpMyAdmin

```bash
sudo apt install phpmyadmin -y
```

During installation:

* **Web server:** select `apache2` (use SPACE, then ENTER)
* **Configure database with dbconfig-common:** Yes
* **Connection method:** Unix socket
* **Authentication plugin:** default
* **Database name:** phpmyadmin
* **MySQL username:** phpmyadmin@localhost
* **Password:** enter a STRONG password

> MySQL enforces a STRONG password policy by default.

Password requirements:

* ≥ 8 characters
* uppercase + lowercase
* number
* special character

Example:

```
MyP@ssw0rd123!
```

---

### 2. Enable phpMyAdmin in Apache

If needed:

```bash
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
sudo systemctl reload apache2
```

---

### 3. Access phpMyAdmin

Open:

```
http://localhost/phpmyadmin
```

Log in using:

* **Username:** phpmyadmin (or another DB user you create)
* **Password:** the MySQL password for that user

---

## If phpMyAdmin Setup Fails (Manual Setup)

Use this section **only if** the installer fails due to MySQL password or authentication issues.

---

### 1. Remove broken phpMyAdmin install

```bash
sudo apt purge phpmyadmin -y
sudo apt autoremove -y
```

---

### 2. Reinstall phpMyAdmin without DB auto-setup

```bash
sudo apt install phpmyadmin
```

When prompted:

* **Configure database with dbconfig-common:** No

---

### 3. Manually create phpMyAdmin database and user

Log into MySQL:

```bash
sudo mysql
```

```sql
CREATE DATABASE phpmyadmin;

CREATE USER 'phpmyadmin'@'localhost'
IDENTIFIED WITH mysql_native_password
BY 'StrongP@ssw0rd123!';

GRANT ALL PRIVILEGES ON phpmyadmin.* TO 'phpmyadmin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### 4. Import phpMyAdmin tables

```bash
sudo mysql -u phpmyadmin -p phpmyadmin < /usr/share/phpmyadmin/sql/create_tables.sql
```

---

### 5. Enable phpMyAdmin in Apache

```bash
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
sudo systemctl reload apache2
```

---

### 6. Verify

Visit:

```
http://localhost/phpmyadmin
```

Login with:

* Username: phpmyadmin
* Password: the one you set

---

## Important Concepts (Read Once)

### MySQL root vs phpMyAdmin user

* **MySQL root**

  * Admin account
  * Uses socket authentication on Ubuntu
  * Accessed via `sudo mysql`

* **phpmyadmin user**

  * Regular MySQL user
  * Uses password authentication
  * Used by phpMyAdmin

They are **completely separate accounts**.

---

## Part 3 — Securing MySQL (Recommended)

### 1. Run MySQL secure setup

```bash
sudo mysql_secure_installation
```

Recommended answers:

* Enable VALIDATE PASSWORD component: Yes
* Password policy: STRONG
* Set root password: No (keep socket authentication)
* Remove anonymous users: Yes
* Disallow remote root login: Yes
* Remove test database: Yes
* Reload privilege tables: Yes

> Keeping MySQL root on socket authentication is more secure than password-based login and prevents remote brute-force attacks.

---

### 2. Verify root authentication method

```bash
sudo mysql
```

```sql
SELECT user, host, plugin FROM mysql.user WHERE user='root';
```

Expected result:

```
root | localhost | auth_socket
```

---

### 3. Ensure MySQL is not exposed remotely

Edit MySQL config:

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Ensure:

```
bind-address = 127.0.0.1
```

Restart MySQL:

```bash
sudo systemctl restart mysql
```

---

## Part 4 — Securing phpMyAdmin (REQUIRED if Public)

> If phpMyAdmin is accessible on a school network or the public internet, this section is not optional.

---

### 1. Never use MySQL root in phpMyAdmin

* MySQL root uses socket authentication
* phpMyAdmin requires password authentication
* Root login in phpMyAdmin is blocked by design and should remain blocked

You must use a **dedicated MySQL user** with a strong password.

---

### 2. Create a dedicated phpMyAdmin user

```bash
sudo mysql
```

```sql
CREATE USER 'school_admin'@'localhost'
IDENTIFIED WITH mysql_native_password
BY 'VeryStr0ng!Password123';

GRANT ALL PRIVILEGES ON *.* TO 'school_admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

(Privileges can be reduced later once everything works.)

---

### 3. Add HTTP authentication (second security layer)

Install tools:

```bash
sudo apt install apache2-utils -y
```

Create password file:

```bash
sudo htpasswd -c /etc/apache2/.pma_passwd adminuser
```

---

### 4. Protect phpMyAdmin with Apache auth

Edit:

```bash
sudo nano /etc/apache2/conf-available/phpmyadmin.conf
```

Inside the `<Directory /usr/share/phpmyadmin>` block, add:

```apache
AuthType Basic
AuthName "Restricted phpMyAdmin"
AuthUserFile /etc/apache2/.pma_passwd
Require valid-user
```

Enable and reload:

```bash
sudo a2enconf phpmyadmin
sudo systemctl reload apache2
```

This enforces:

1. HTTP authentication
2. MySQL authentication

---

### 5. Disable root login and passwordless login in phpMyAdmin

Edit:

```bash
sudo nano /etc/phpmyadmin/config.inc.php
```

Ensure:

```php
$cfg['AllowNoPassword'] = false;
$cfg['Servers'][$i]['AllowRoot'] = false;
```

---

### 6. Optional: Obscure phpMyAdmin URL

```bash
sudo mv /usr/share/phpmyadmin /usr/share/pma-secure
sudo ln -s /usr/share/pma-secure /var/www/html/internal-db
```

Access via:

```
http://yourserver/internal-db
```

---

## Security Notes (Read Carefully)

* MySQL root **does not** share a password with phpMyAdmin users
* phpMyAdmin root login being blocked is expected and correct
* phpMyAdmin is a frequent attack target — never expose it without protection
* For school environments, prefer IP restrictions or VPN access

---

## Recommended Best Practice

* Keep MySQL root on socket authentication
* Use strong, unique passwords for all MySQL users
* Use least-privilege database access
* Add HTTP auth in front of phpMyAdmin
* Use HTTPS if accessible beyond localhost
* Do not expose phpMyAdmin unnecessarily

---
