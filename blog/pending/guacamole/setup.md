# Guacamole Setup
For this install, I completely used the following repo:<br>
```https://github.com/boschkundendienst/guacamole-docker-compose```

A copy of this repo can be found in this directory.

This method has run reliably in my homelab for almost a year now (as of November 2025).

 ## Notes
Within the repo's README, there is no explicit instruction to run ```docker compose up -d``` after running ```./prepare.sh```. When first using this repo, I assumed that the Bash script autoexecuted the docker compose command.


After running ```docker ps``` and seeing that ```guacamole_compose```, ```nginx_guacamole_compose```, ```guacd_compose``` and ```postfres_guacamole_compose``` are all healthy, you may go to ```https://<machine-ip>:8443``` and log in with the default credentials.

Default username: ```guacadmin```<br>
Default password: ```guacadmin```


If you did not implement TLS/SSL, you may see a message resembling the following:


> Your connection isn't private<br>
> Attackers might be trying to steal your information from 100.127.139.65 (for example, passwords, messages, or credit cards).<br>
> net::ERR_CERT_AUTHORITY_INVALID


If you are not using this in production, this is perfectly fine. Simply click ```Advanced``` (or something similar) and ```Continue```.
