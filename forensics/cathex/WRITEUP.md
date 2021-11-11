# Writeup - CatHex

This challenge is intended to give participant opportunity to learn and improve their forens skill from image.

By downloading the image file, image with a cat imposing as Julius Caesar with some followers will appeared.

By observing the challenge of the name, open the image in hex file and it will show data like this:

...						...
DD FF 00 62 92 6F 80 B6 73 CB B9 EF 1B C9 FE 28	Ýÿ�b’o€¶sË¹ïÉþ(	
D2 DD 76 BE CD FB 7F 87 FB AF 26 EF EF FF 00 1F ÒÝv¾Íû‡û¯&ïïÿ�
9B 5E 83 F2 FF 00 CF 3F D2 9B 24 6B 40 1E 79 17 ›^ƒòÿ�Ï?Ò›$k@y
EC F1 63 05 CF EE EF 6E A0 87 76 ED B1 42 AB FD ìñcÏîïn ‡ví±B«ý
...						...

and at the bottom of that hexfile we can fing the encrypted flag.

...
48 43 42 4B 4D 43 42 7B 62 34 54 4A 42 34 33 73 HCBKMCB{b4TB43s
34 52 73 54 79 6C 33 7D				4RsTyl3}

By observing the image and doing some research about it, we will know that this is an image of cat imposing as Julius 
Caesar.  From all popular cipher technique, there is one technique known as Caesar Cipher.  Which match with the info
given.

To decrypt that, we can use online or manual decryption (online resources: https://cryptii.com/pipes/caesar-cipher).

In Caesar Cipher, we will need the number of shift and the alphabet before we decrypt it.

For the shift, we will know from the number of cat followers of Julius Caesar.  The alphabet is written in the roll 
paper Julius Caesar hold, which show 'abc'.

So with this we now have information of:

Ciphertext: HCBKMCB{b4TB43s4RsTyl3}
Cipher	  : Caesar Cipher
Shift	  : 8
Alphabet  : abc

Then we can decrypt the file and we get the flag!

Flag: HACKMAC{c4TC43s4RsTyl3}





