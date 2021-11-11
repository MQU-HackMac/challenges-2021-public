import os
import binascii
import codecs
from base64 import b64decode

os.system('mv flag flag.xz')
os.system('xz -d flag.xz')

os.system('mv flag flag.zip')
os.system('unzip flag.zip')

os.system('mv flag flag.tar')
os.system('tar xvf flag.tar')

os.system('mv flag flag.xz')
os.system('xz -d flag.xz')

os.system('mv flag flag.zip')
os.system('unzip flag.zip')

os.system('mv flag flag.bz2')
os.system('bunzip2 flag.bz2')

os.system('mv flag flag.gz')
os.system('gunzip flag.gz')

os.system('mv flag flag.zip')
os.system('unzip flag.zip')

with open('flag.txt', 'r') as f:
    b64 = f.read()

ascii = b64decode(b64).decode()

octal = ''.join([chr(int(x)) for x in ascii.split()])

hex = ''.join([chr(int(x, 8)) for x in octal.split()])

rot = binascii.unhexlify(hex).decode()

flag = codecs.encode(rot, 'rot_13')

print(flag)
