# hack_MAC Writeup

We are given a java file, 'SecretClub1.java' where it displays 4 lines of lengthy code that doesn't look neat or readable. Firstly, we need to make the code neat, and readable so it is easier to read and we can try to find the flag. We can manually go through and make the code neater, or if we are using an application such as Visual Studio Code, we can simply format document (Alt + Shift + f), and now our code is neat and readable.

Upon unspection of the java file we see three sections of code. We see there is a checkPassword section, which we can assume is how we will find the password, a section where we run the code (similar to the SecretClub1), and a passwordToIntArray section. 

When inspecting the passwordToIntArray section, there is an information blurb above which describes what is happening with the bytes. We learn that an int value contains 32 bits, and if we combine 4 bytes together (4 combined binary valyes), we can express it as an interger. 

Now we can inspect the checkpassword section. Upon inspection, we can see we are given 8 integers which we need to interpret back into letters which should provide us the flag.

A simple way to do this is to first, grab the integer and convert it into a binary value. If we start with x[0] value 1650029619, it converts it into the binary value: 1100010010110010111010000110011
When we split this binary value into 4 bytes (8 bits each) we get 01100010 01011001 01110100 00110011. Now if we covert these binary values into ASCII values, we recieve 'bYt3' which is the first part of the flag. Now we can repeat the process for the rest of the bytes: 

x[1] == 2053059694 == --> z_4n
x[2] == 1147093553 --> D_B1
x[3] == 1312060025 --> N4ry
x[4] == 1599091811 --> _P4c
x[5] == 1261530681 --> K1n9
x[6] == 1600730463 --> _i5_
x[7] == 1664118604 --> c0oL

And now once we combine all the results, we receive bYt3z_4nD_B1N4ry_P4cK1n9_i5_c0oL, which is the correct password and our flag!