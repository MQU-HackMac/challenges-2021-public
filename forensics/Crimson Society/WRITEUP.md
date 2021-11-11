Crimson Society

In this challenge participants are tasked with uncovering a flag hidden in one of the images along the way, participants will apply basic steganography and cryptography skills in order to reach the flag. some of the images will have hidden data that act as clues or so that participants know what to do.

1.	Participants are given 4 images, first we reverse image search the image in order to find the original image which will allow us to determine which of the images are edited through viewing and comparing MD5 hashes.
2.	We find that the first image in the set is the original image off google and when checked contains no hidden data.
3.	We then check the second image which when opened with a text editor has encrypted text which hints at the correct image being larger in size
4.	The fourth image has a pretty big file size when compared to the original and so users may run basic steganography techniques on it with the solution being to open it as a zip     file which will reveal encrypted (Caesar cipher) flavour text and an image.
5.	By using a hex editor on the final image, users will uncover the encrypted flag which when decrypted using base64 will reveal the flag.

