Firstly, you look at the binary message and understand the use of the series of 8 byte binary numbers

```
 #!/usr/bin/env python3 
binary = 01000110 01001010 01000101 01010110 01010100 01010011 \ 
01010101 01111011 01011001 01001111 \ 
 01110101 00100111 01110010 01100101 00100000 01000001 00100000 \ 
01000010 01001001 01101110 01100001 01010010 01011001 00100000 \ 
 01110111 01001001 01111010 01100001 01010010 01100100 00100100 \ 
 01111101".split() 
 flag = [int(a, 2) for a in binary] 
 print("".join(map(chr, flag))) 
 
```

Take the hint from the CTF file ‘Hints’ that indicates what letters do binary files give you?


You will then web search a binary to text convertor on the internet or you can 
decrypt the binary file manually or on a sheet of paper.

<img width="645" alt="Screen Shot 2021-10-20 at 10 01 23 am" src="https://user-images.githubusercontent.com/68882121/138002164-08a2d83c-75f5-4223-8044-6646d3c87056.png">



After solving the output of the binary numbers, the participant will get the flag 
> FJEVTSU{YOu're A BInaRY wIzaRd$}

You then need to look at the Take the hint from the CTF file ‘Hints’ that highlights there is more than one key to find and the hint from the CTF file ‘Hints’ that specifies the Cipher was invented in 1553.

You should also look at the Cipher Clue file that gives the formula ‘Di = (Ei - Ki + 26) mod 26’. This will help you into understand the correct formula to use by using the first flag you received from decrypting the binary file and decrypting that file using the Vignere cipher formula using the key 'cryptii'

You then decode the Vigenere Formula manually or you can find a website that can automatically decode the message using the formula and key.

<img width="1213" alt="Screen Shot 2021-10-20 at 9 59 01 am" src="https://user-images.githubusercontent.com/68882121/138001953-2a5c4946-93b2-43d8-8a7b-0a845cf72ad7.png">

And we get our flag! 
> HACKMAC{AFs'gx I JKeyGR eQbrPs$}
