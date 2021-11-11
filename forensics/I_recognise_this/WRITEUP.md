Analyse the file using 'file flag' it tells you that it has been compressed.
Use various decompression types to get the original file. 
Make sure to add the correct extension to the flag file so the decompressor can easily recognise it.

decompressing zip: unzip flag.zip

decompressing gzip: gzip -d flag.gz

decompressing bzip2: bzip2 -d flag.bz2

decompressing tar: tar -xf flag.tar

decompressing xz: xz -d flag.xz

You will be given flag.txt which contains unreadable text. You must convert it a few times to get it to a readable stage.

base64 -> text

ascii -> text

octal -> text

hex -> text

This text is somewhat readable and in the form of the flag but not quite right. Rotate each character by 13. 

HACKMAC{EnCrYpT10n_c0nV3rSi0n_&_c0mPr3s51On}