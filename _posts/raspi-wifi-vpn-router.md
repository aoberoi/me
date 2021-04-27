---
title: Build a WiFi VPN Router with a Raspberry Pi
---

### TODO

* Add a diagram to the "What we're going to build" section.
* Write another guide for setting up the VPN server, link to it in the "What we're using" section.
* Embed affiliate links?
* Contact page

## What we're going to build

This guide will help you add a new WiFi network to your existing home network. Devices which connect to the new network
will send all their traffic through a VPN server before reaching the Internet.

This allows devices which don't have VPN client software available (such as a smart TV) to use a private, secure
connection to the Internet. It's also really useful for getting those devices to seem like they are in a different
geographic location than where they truly are 😉.

## What we're using

In this guide, we'll be using the following:

* [Raspberry Pi 3 - Model B+](https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus/)
* A MicroSD card of [recommended minimum size 4GB](https://www.raspberrypi.org/documentation/installation/sd-cards.md)
  and a card reader to load software onto the card from your PC or Mac. Alternatively, you can buy an MicroSD cards with
  [NOOBS](https://www.raspberrypi.org/downloads/noobs/) already loaded on.
* A [WireGuard](https://www.wireguard.com/) VPN server and an associated client configuration.
* A home router with an available wired Ethernet port, and a network cable
* A computer on the network to run `ssh` from

If your hardware or software doesn't exactly match the list above, you may still be able to follow these steps (but
perhaps with a few modifications). If you have any information that could be useful to other readers, [let me
know](https://aoberoi.me/contact).

## Install Raspbian

Let's get an operating system onto the Raspberry Pi. Raspbian is great for our purposes. It also happens to be the most
popular OS for the device, so it comes with great software tools for the Raspberry Pi's specific hardware. And since
it's based on Debian, there's a ton of information around the web that mostly applies directly.

At the time of writing, Raspbian Buster is the latest version, and we will use the Lite flavor. [Download and install an
imager](https://www.raspberrypi.org/downloads/) for your PC or Mac's operating system. Next, [download the Raspbian
Buster Lite](https://www.raspberrypi.org/downloads/raspbian/) image. Use the imager to load the operating system onto
your MicroSD card.

Before you put the MicroSD card into your Raspberry Pi or boot it up, let's [enable
SSH](https://www.raspberrypi.org/documentation/remote-access/ssh/). Enabling SSH allows you to access the command line
of your Raspberry Pi from another PC or Mac, without having to connect a keyboard, mouse, or display directly. You can
plug in just the power and network cables, and then hide the Raspberry Pi away. On my Mac, I did this by unplugging
my card reader and plugging it back in so that the `boot` drive was visible in Finder. Then I created a new empty file
on that drive using the following command (in Terminal.app):

```shell
$ touch /Volumes/boot/ssh
```

**Note:** The `$ ` is not something you should type, it's only there to illustrate that the following command is typed
into your shell (in the Terminal).

**Note:** If you're instead using a MicroSD card with NOOBS loaded into it, you can put it into your Raspberry Pi, plug
in the power, network cable, keyboard, mouse, and display. Boot up the Raspberry Pi and select Raspbian to install. Now
when your Raspberry Pi reboots, you'll be in the graphical desktop interface. Follow the on screen setup guide. Once
that is complete, you'll use the menu in the top left, select "Preferences" and then "Raspberry Pi Configuration." In the window that opens, switch to the "Interfaces" tab and set SSH to "Enabled." When you close the window, you'll be asked to restart, and you should choose "Yes." Now you can disconnect the keyboard, mouse, and display and continue
with the rest of the guide.

Place the MicroSD card in the Raspberry Pi, and you're ready to boot up!

## Connect using SSH

Plug your Raspberry Pi into your router and into a power source. Once it boots up, your router will assign it an IP
address. We need to find that IP address in order to connect. On most routers, you can log into the management website
(commonly found at http://192.168.1.1) to view a list of the connected devices and their IP addresses. The easiest way
to find the IP address for your Raspberry PI is to find it on the list.

[Image]

Write down the IP address for your Raspberry Pi.

> Raspberry Pi IP address (wired): `192.168.2.200`.

**Note:** If you can't easily identify which device in the list is your Raspberry Pi, try unplugging the network cable,
waiting for an item to disappear (or refresh the page), and then plugging the network cable back in. The newest item
added to the list should be your Raspberry Pi.

Open your command line and connect to the Raspberry Pi using the default username (`pi`) and password (`raspberry`).
Substitute your Raspberry Pi's IP address instead of mine. After entering the first command below, you'll be asked
for the password. As you type `raspberry`, the characters won't appear, and that's okay. Just hit <kbd>Enter</kbd> after
typing the password. After entering the password, a login message will appear followed by a new prompt showing that
you're logged in as the user `pi` on the hostname `raspberrypi`.

```shell
$ ssh pi@192.168.2.200
pi@192.168.2.200's password:
# Login message not shown
pi@raspberrypi:~ $
```







SSH into it, change the password, do the `sudo raspi-config` thing.

Update the tool. Enable predictable network interface names. Pick a locale. Reboot.

 `sudo apt-get update && sudo apt-get upgrade`, reboot.


## Notes


`sudo apt-get install vim`

Assumption: Before we do anything about VPN (just to get the Pi to act like an access point) we're setting up a static
IP for `wlan0` because we want it to be on the same network as `eth0`.

static IP I chose was 192.168.2.201/24 because i've configured the router to only use the range 192.168.2.2-200

dnsmasq is a DHCP server and DNS server

dnsmasq is configured to give out IP addresses in the range 192.168.2.202-254

`/etc/sysctl.conf`: enabled packet forwarding for IPv4, but didn't do it for IPv6. Come back to this?

this time, start the services before continuing and debug any issues starting them up

when trying to start `hostapd`, an error shows up about the service being masked. this is how we get past that:
`sudo systemctl unmask hostapd`
`sudo systemctl enable hostapd`
`sudo systemctl start hostapd`

`sudo systemctl start dnsmasq`

if we get stuck, plug in the keyboard and display locally to keep going and see what happened.

i might need to take out the `bridge=br0` line from `/etc/hostapd/hostapd.conf`. that seemed to screw things up in
the past

Get the wireguard package right after installing `bridge-utils`:
  `sudo apt-get install raspberrypi-kernel-headers`
  `echo "deb http://deb.debian.org/debian/ unstable main" | sudo tee --append /etc/apt/sources.list.d/unstable.list`
  `sudo apt-get install dirmngr`
  `wget -O - https://ftp-master.debian.org/keys/archive-key-$(lsb_release -sr).asc | sudo apt-key add -`
  `printf 'Package: *\nPin: release a=unstable\nPin-Priority: 150\n' | sudo tee --append /etc/apt/preferences.d/limit-unstable`
  `sudo apt-get update`
  `sudo apt-get install wireguard`

don't run `sudo brctl addif br0 eth0` until after editing the `/etc/network/interfaces` file

interface name: `enxb827ebee31a7`
## Shout outs

https://github.com/adrianmihalko/raspberrypiwireguard


2 problems:
1) ssh issues
2) dnsmasq is not assigning IP addresses

hypothesis: there's some issue with DNS which makes the routing impossible

Maybe the wlan0 interface on Pi should have a static IP address that makes it a separate subnet from the IP addresses
the router's DNS is assigning. for example, let 192.168.2.x be the router, and 192.168.3.x be the Pi's network.

Going to read mr-conoehead's instructions to compare/contrast to see if this theory holds up.

main differences:
1. dhcpcd is only provides DHCP on the wired interface, therefore `denyinterfaces wlan0`. but this line comes before any other interface rules.
2. dnsmasq only provides DHCP on the wireless interface, therefore `no-dhcp-interface=eth0`. range doesn't try to describe the subnet mask.
3. uses dhcpcd to set static IP on wired interface, not the wireless interface. uses `/etc/network/interfaces.d/wlan0` to set a static IP on the wireless interface.
4. no use of a bridge interface `br0`. instead, `iptables` is used to move packets from one interface to another (i think).
5. used a separate number in the 2nd octet of the ip address for dnsmasq
6. uses different options for the `hostapd.conf` file. specifically, does not use the `bridge=` option.
7. `iptables` rules are all generated through a script. uses `iptables-persistent` to save/restore them on restart instead of `/etc/rc.local`

* the static ip for the wired interface is a different network than the router's network. for example, we're using `192.168.2.200` (part of `192.168.2.0`), and they are using `10.1.2.50` (part of `10.1.2.0`, not `10.1.1.0`). but i've used the router's configuration
to make sure the DHCP address ranges don't overlap.


dnsmasq was not forwarding DNS requests anywhere in specific, so i had to add this to /etc/dnsmasq.conf
no-resolv

# Google's nameservers, for example
server=8.8.8.8
server=8.8.4.4

https://github.com/adrianmihalko/raspberrypiwireguard

assuming i've created `/etc/wireguard/150VN.conf`, do the following to get wireguard to start up automatically:
(start disconnected)
`sudo systemctl enable wg-quick@150VN.service`
`sudo systemctl daemon-reload`
`sudo systemctl start wg-quick@150VN`

https://www.ivpn.net/knowledgebase/255/Linux---Autostart-WireGuard-in-systemd.html

maybe DNS lookup for kinglet.aoberoi.dev will be a problem?

not going to change the logrotate configuration. i don't think disk space will be a big concern.

`sudo apt install -y iptables-persistent`

configuring the wireless network interface

these commands come before the `ifdown`/`ifup`:
`rfkill unblock wlan`
`sudo ip addr flush dev wlan0`

`sudo apt install -y hostapd`



https://www.ckn.io/blog/2017/12/28/wireguard-vpn-portable-raspberry-pi-setup/
