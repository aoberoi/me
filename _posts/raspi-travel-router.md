---
title: Build a Travel Router with a Raspberry Pi
---

1. Update packages
  ```
  $ sudo apt update
  ```

2. Install packages
  ```
  $ sudo apt install hostapd # allows device to be a WiFi host instead of a client
  $ sudo apt install dnsmasq # DNS server (so that clients don't need to assign static IPs on their own)
  $ sudo apt install iptables-persistent # save (and load on startup) firewall rules.
  ```

3. Set up Wifi host
  ```
  $ sudo systemctl unmask hostapd.service
  $ sudo systemctl enable hostapd.service
  ```

4. Configure DHCP client
  ```
  $ sudo vi /etc/dhcpcd.conf
  ```

  Turn off DHCP on the wlan0 interface, and instead use a static IP address (and subnet mask). Ignore the SSID info, since we're not connecting to some other network

  ```
  interface wlan0
          static ip_address=10.20.1.1/16
          nohook wpa_supplicant
  ```

5. Enable routing
  ```
  $ sudo vi /etc/sysctl.d/routed-ap.conf
  ```

  Add the following:
  ```
  net.ipv4.ip_forward=1
  ```

6. Configure routes
  ```
  $ sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
  $ sudo su
  # iptables-save > /etc/iptables/rules.v4
  # exit
  ```

7. Set up local DHCP and DNS server for clients on wlan0
  ```
  $ sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.bak
  $ sudo vi /etc/dnsmasq.conf
  ```

  Add the following:
  ```
  interface=wlan0
  dhcp-range=10.20.2.0,10.20.2.255,255.255.0.0,72h
  domain=pirouter
  address=/pi.pirouter/10.20.1.1
  ```

8. Configure wlan0 interface as an access point
  ```
  $ sudo vi /etc/hostapd/hostapd.conf
  ```

  Add the following:
  ```
  country_code=US
  interface=wlan0
  ssid=Cowabunga
  hw_mode=any
  channel=acs_survey
  macaddr_acl=0
  auth_algs=1
  ignore_broadcast_ssid=0
  wpa=2
  wpa_passphrase=EatMyShorts
  wpa_key_mgmt=WPA-PSK
  wpa_pairwise=TKIP
  rsn_pairwise=CCMP
  ```

