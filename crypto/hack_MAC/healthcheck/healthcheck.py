#!/usr/bin/env python3

import asyncio
import binascii
import sys

import hashpumpy


async def send_message(host: str, port: int, cmd: bytes, mac: bytes):
    reader, writer = await asyncio.open_connection(host, port)

    length = len(cmd).to_bytes(2, 'big')
    writer.write(length + cmd + mac)

    reply = await reader.readline()
    result = reply

    while reply:
        reply = await reader.readline()
        result += reply

    return result.decode()


LIST_VACCINE_MAC = 'c34746da6d8d5b1e9ec578a9dfa3e87aa4a09cc5e773674345a2db1c0b05cd03'

new_mac, new_cmd = hashpumpy.hashpump(LIST_VACCINE_MAC, 'list_vaccines', '_prototype', 42)
new_mac = binascii.unhexlify(new_mac)

ret = asyncio.run(send_message('127.0.0.1', 1337, new_cmd, new_mac))

if 'HACKMAC' in ret:
    sys.exit(0)
else:
    sys.exit(1)

