# hack_MAC Writeup

We are given a java file, 'SecretClub1.java' where it displays code and a description asking for a password to be able to join this secret club.

Upon inspection of the java file we see two sections of code. We see there is a checkPassword section, which we can assume is how we will find the password, and a section where we run the code. When we run the code, we see a message asking us to input a password, which we believe will be the flag for the challenge. Now we know that this section is for entering the password, we can focus on the checkPassword section.

When inspecting the checkPassword section, we see that we a provided a bunch of bytes that are different encodings (including ASCII, hex and octal), a "password.getBytes()", and a 'for' loop that returns false if "if (passBytes[i]+3 != myBytes[i])". We can gather from this code that the password will be provided if we decode the bytes back to ASCII form, and add them all together.

First, we can decode the first 8 bytes which appear to be in octal values. Decoding these bytes gives us "f, D, 6, V, d, U, b, u".

Secondly, the second 8 bytes are in hex form, so when we decode them back to ASCII form, we are provided " 6, Y, 6, u, 8, h, g, b, l"

Lastly, we already have the last 8 byte values which are "8, b, u, D, v, 6, D, f".

Now we put all the bytes together and we now have "fD6VdUbu6Y6u8hgbl8buDv6Df" but this doesnt look like a flag. The 'for' loop that checks the password has a '+3', which is actually Caesar Ciphering the correct password +3. So in order to get the password we need to cipher it back -3, and we should have our password.

When we cipher the bytes we get "cA3SaR_r3V3r5ed_i5_rAs3Ac"and when we use this as the password like such "HACKMAC{cA3SaR_r3V3r5ed_i5_rAs3Ac}", we are accepted into the club, and we know that this is the flag!

HACKMAC{cA3SaR_r3V3r5ed_i5_rAs3Ac}