# WAMP: Localhost on 8080, LAN on 80 (Same DocumentRoot)

This document records the **exact steps** required to configure WAMP so that:

* `localhost:8080` → **local-only access**
* `LAN on port 80` → **LAN-wide access**
* Both serve from the same directory: `${INSTALL_DIR}/www`

---

## Goal

| Access Type | Address     | Port | Access Control        | DocumentRoot         |
| ----------- | ----------- | ---- | --------------------- | -------------------- |
| Local only  | `localhost` | 8080 | `Require local`       | `${INSTALL_DIR}/www` |
| LAN-wide    | `<PC-IP>`   | 80   | `Require all granted` | `${INSTALL_DIR}/www` |

---

## 1. Edit Virtual Hosts Configuration

**File:**

```
c:/wamp64/bin/apache/apache2.x.x/conf/extra/httpd-vhosts.conf
```

### A. Localhost (port 8080, local only)

```apache
<VirtualHost *:8080>
  ServerName localhost
  DocumentRoot "${INSTALL_DIR}/www"

  <Directory "${INSTALL_DIR}/www/">
    Options +Indexes +Includes +FollowSymLinks +MultiViews
    AllowOverride All
    Require local
  </Directory>
</VirtualHost>
```

### B. LAN-wide access (port 80)

```apache
<VirtualHost *:80>
  ServerName lan
  DocumentRoot "${INSTALL_DIR}/www"

  <Directory "${INSTALL_DIR}/www/">
    Options +Indexes +Includes +FollowSymLinks +MultiViews
    AllowOverride All
    Require all granted
  </Directory>
</VirtualHost>
```

> **Important:** Never use `Require all granted` on the `localhost` VirtualHost.

---

## 2. Ensure Apache Is Listening on Both Ports

**File:**

```
c:/wamp64/bin/apache/apache2.x.x/conf/httpd.conf
```

Confirm these lines exist:

```apache
Listen 0.0.0.0:80
Listen [::]:80
Listen 0.0.0.0:8080
Listen [::]:8080
```

Without `Listen 8080`, the localhost VirtualHost will not work.

---

## 3. Windows Firewall Configuration

Apache must be allowed through the firewall for LAN access.

### Steps

1. Open **Windows Defender Firewall**
2. Select **Allow an app or feature through the firewall**
3. Ensure **Apache HTTP Server** is allowed on:

   * ✅ **Private** networks

If missing, manually add:

```
c:/wamp64/bin/apache/apache2.x.x/bin/httpd.exe
```

Restart WAMP after applying changes.

---

## 4. Verify Apache Is Listening

Run in **Command Prompt (Admin)**:

```bat
netstat -ano | findstr :80
```

Expected output includes:

```
0.0.0.0:80     LISTENING
0.0.0.0:8080   LISTENING
```

---

## 5. Access URLs

### From the WAMP machine

```
http://localhost:8080/
```

### From another LAN device

```
http://<PC-IP>/
```

Example:

```
http://192.168.6.4/
```

---

## Notes

* WAMP enforces security rules on the `localhost` VirtualHost
* Port separation avoids warnings and unpredictable behavior
* This setup is stable and WAMP-compliant

---

**Status:** Working configuration
