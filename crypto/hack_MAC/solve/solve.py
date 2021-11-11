import asyncio
import binascii
from hashlib import sha256
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


def generate_mac(cmd: str, secret: str) -> bytes:
    return sha256(secret.encode() + cmd.encode()).digest()


# Obtained from pcap
LIST_VACCINE_MAC = 'c34746da6d8d5b1e9ec578a9dfa3e87aa4a09cc5e773674345a2db1c0b05cd03'

for i in range(1, 2**8):
    new_mac, new_cmd = hashpumpy.hashpump(LIST_VACCINE_MAC, 'list_vaccines',
                                          '_prototype', i)
    new_mac = binascii.unhexlify(new_mac)

    ret = asyncio.run(send_message('localhost', 1337, new_cmd, new_mac))

    if 'HACKMAC' in ret:
        print(i)
        print(ret)
        exit()
