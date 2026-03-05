# Docker Engine Setup for Ubuntu
*Source: https://docs.docker.com/engine/install/ubuntu/*

## Prerequisites

### Firewall limitations
Before installing Docker, consider the following security implications and firewall incompatibilities:

- If you use **ufw** or **firewalld**, exposing container ports bypasses firewall rules.  
  See: [Docker and ufw](https://docs.docker.com/network/iptables/).

- Docker is only compatible with **iptables-nft** and **iptables-legacy**.  
  Firewall rules created with nft are not supported. Add rules to the `DOCKER-USER` chain.  
  See: [Packet filtering and firewalls](https://docs.docker.com/network/iptables/).

### OS requirements
Docker Engine requires a **64-bit version** of Ubuntu:

- Ubuntu Questing 25.10  
- Ubuntu Plucky 25.04  
- Ubuntu Noble 24.04 (LTS)  
- Ubuntu Jammy 22.04 (LTS)

Supported architectures: `x86_64` (amd64), `armhf`, `arm64`, `s390x`, `ppc64le` (ppc64el).  

> Installation on Ubuntu derivatives like Linux Mint is not officially supported.

## Uninstall old versions
Remove any conflicting packages:

```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do
  sudo apt-get remove $pkg
done
````

> Images, containers, volumes, and networks stored in `/var/lib/docker/` are **not automatically removed**. See "Uninstall Docker Engine" to clean these.

## Installation methods

You can install Docker Engine in multiple ways:

1. **Docker Desktop for Linux** (bundled with Docker Engine, easiest method)
2. **Apt repository** (recommended for regular use)
3. **Manual installation** (using `.deb` files)
4. **Convenience script** (for testing and development, not recommended for production)

---

## Install using the apt repository

### 1. Add Docker’s official GPG key

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

### 2. Add the repository

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

### 3. Install Docker

To install the latest version:

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

* Docker service starts automatically.
* Verify with:

```bash
sudo systemctl status docker
```

* Start manually if needed:

```bash
sudo systemctl start docker
```

* Verify installation:

```bash
sudo docker run hello-world
```

> Tip: Non-root users cannot run Docker by default. See "Post-installation steps for Linux" to enable this.

---

## Upgrade Docker Engine

Follow the same steps as installation but choose the new version to install.

---

## Install from a package

If you cannot use the repository:

1. Download `.deb` packages from:
   [https://download.docker.com/linux/ubuntu/dists/](https://download.docker.com/linux/ubuntu/dists/)

2. Install:

```bash
sudo dpkg -i ./containerd.io_<version>_<arch>.deb \
  ./docker-ce_<version>_<arch>.deb \
  ./docker-ce-cli_<version>_<arch>.deb \
  ./docker-buildx-plugin_<version>_<arch>.deb \
  ./docker-compose-plugin_<version>_<arch>.deb
```

* Verify Docker as described above.

---

## Install using the convenience script

1. Download the script:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
```

2. Run it:

```bash
sudo sh get-docker.sh
```

* For a dry run:

```bash
sudo sh ./get-docker.sh --dry-run
```

> The script is for development environments. It may upgrade Docker unexpectedly.

---

## Install pre-releases

1. Download the test script:

```bash
curl -fsSL https://test.docker.com -o test-docker.sh
```

2. Run it:

```bash
sudo sh test-docker.sh
```

> Use pre-releases only in test environments.

---

## Upgrade Docker after using the convenience script

Use your **package manager** to upgrade, not the script.

---

## Uninstall Docker Engine

```bash
sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
```

* Remove images, containers, volumes:

```bash
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

* Remove sources and keyrings:

```bash
sudo rm /etc/apt/sources.list.d/docker.list
sudo rm /etc/apt/keyrings/docker.asc
```

> Edited configuration files must be removed manually.

---

## Next steps

See [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/) for optional configuration and non-root user setup.

```
