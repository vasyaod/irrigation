# Irrigation system improvements


## Test of valve

For this purpose the tool is required https://hivemq.github.io/mqtt-cli/

```
mqtt pub -h 192.168.10.105 -t valve/channel/1 -m "test"
```