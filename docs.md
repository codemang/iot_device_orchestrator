## Start SSH on boot

Add this to your ~/.bashrc

```
eval `ssh-agent -s`
ssh-add
```

https://stackoverflow.com/questions/17846529/could-not-open-a-connection-to-your-authentication-agent
