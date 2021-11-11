import asyncio
import sys
from asyncio import StreamReader, StreamWriter
from hashlib import sha256
from textwrap import dedent

from lib import add_vaccine, get_prototypes, get_vaccines, remove_vaccine

HASH_LENGTH = len(sha256(b'').digest())  # 32
SECRET = b"$supersupersecurepasswordthatyouwontguess$"


async def handle_command(reader: StreamReader, writer: StreamWriter):
    # Read the length of the message, stored in first 2 bytes
    length = await reader.readexactly(2)
    length = int.from_bytes(length, 'big')

    msg = await reader.readexactly(length + HASH_LENGTH)

    full_cmd = msg[:length]
    mac = msg[length:length + HASH_LENGTH]

    print(length, msg, full_cmd, mac)

    if mac == generate_mac(full_cmd):
        print('valid')
        out = run_command(full_cmd)
        writer.write(out.encode() + b'\n')
    else:
        writer.write(b'Unauthorized: Invalid Secret\n')
        print('invalid')

    writer.close()


def generate_mac(cmd: bytes) -> bytes:
    return sha256(SECRET + cmd).digest()


def run_command(full_cmd: bytes) -> str:
    # Need to remove bad bytes
    full_cmd: str = ''.join([chr(c) for c in full_cmd if 32 <= c <= 127])
    cmd = full_cmd.split(' ')[0]
    args = full_cmd.split(' ')[1:]

    print(f'RUNNING: {cmd} {args}')

    if cmd == 'help':
        return dedent('''
        Available Commands:
        help:                   Display this message
        list_vaccines:          List all vaccines in the database
        add_vaccine <name>:     Add a vaccine to the database
        remove_vaccine <name>:  Remove a vaccine from the database

        Experimental:
        list_vaccines_prototype:        List prototype formulas
        ''')
    elif cmd == 'list_vaccines':
        vaccines = get_vaccines()
        return '\n'.join([str(x) for x in vaccines])
    elif cmd == 'add_vaccine':
        name = args[0]
        success = add_vaccine(name)
        return 'Added' if success else 'Failed'
    elif cmd == 'remove_vaccine':
        name = args[0]
        success = remove_vaccine(name)
        return 'Removed' if success else 'Failed'
    elif cmd == 'list_vaccines_prototype':
        protos = get_prototypes()
        return '\n'.join([str(x) for x in protos])
    else:
        return f'command: {cmd} not found'


async def main(host: str, port: int):

    server = await asyncio.start_server(handle_command, host, port)
    print(f'Server running on port {port}')

    async with server:
        await server.serve_forever()


if __name__ == '__main__':
    port = int(sys.argv[1])

    try:
        asyncio.run(main('0.0.0.0', 1337))
    except KeyboardInterrupt:
        quit()
