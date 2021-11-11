import asyncio
import binascii
import sys
from hashlib import sha256

HASH_LENGTH = len(sha256(b'').digest())  # 32
SECRET = b"$supersupersecurepasswordthatyouwontguess$"


def generate_mac(cmd: bytes) -> bytes:
    res = sha256(SECRET + cmd).digest()
    print(binascii.hexlify(res))
    return res


async def main(host: str, port: int):
    cmd = sys.argv[1]
    try:
        hash = sys.argv[2]
    except IndexError:
        hash = ""

    reader, writer = await asyncio.open_connection(host, port)

    if hash:
        length = len(binascii.unhexlify(cmd)).to_bytes(2, 'big')
        writer.write(length + binascii.unhexlify(cmd) +
                     binascii.unhexlify(hash))
    else:
        length = len(cmd).to_bytes(2, 'big')
        mac_cmd = cmd.encode() + generate_mac(cmd.encode())
        writer.write(length + mac_cmd)

    reply = await reader.readline()
    while reply:
        print(reply.decode('ascii'), end='')
        reply = await reader.readline()


if __name__ == '__main__':
    try:
        asyncio.run(main('127.0.0.1', 1337))
    except KeyboardInterrupt:
        quit()
