# Writeup

The binary data of the file looks similar to that of a png file

So edit the file with a hex editor and make sure all the chunk structures are there
Using a browser hex editor like hexed.it is usefull, or editing the file in vim using :%!xxd


Start of header should be 89 50 4E 47 0D 0A 1A 0A (from address 0x0000 till 0x0007)

Next to the start it should say 'IHDR' with the values 49 48 44 52 (from address 0x000c till 0x000f)

A few lines down after it should have 'IDAT' with the values 49  44 41 54 (from address 0x0057 till 0x005a)

And near the end it should have 'IEND' with the values 49 45 4e 44 (from address 0x74a1 till 0x74a4)

Fix these correctly and the image file should open up
