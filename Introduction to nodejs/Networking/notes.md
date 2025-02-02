# **Networking**


**SSH** 
- Check if SSH is installed or not
- - ssh -V
- - dpkg -l | grep openssh-client
- - dpkg -l | grep openssh-server

- SSH installation
- - sudo apt update
- -  sudo apt install openssh-server

- Check SSH server status
- - sudo systemctl status ssh

- Start SSH server
- - sudo systemctl start ssh
- - sudo systemctl enable ssh

- Allow Firewall to connect SSH
- - sudo ufw allow ssh

- Generate Key
- - ssh-keygen => this create the public and private key and we can then place the public key to the server and then use without password.
- - we can create the alias for the host and username in the config file(if not present then create).