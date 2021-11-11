# Warehouse Writeup

Looking at the source code of the page. You find there is a comment of a link that leads to the login page. The interesting part is that it has the debug GET parameter set to 1. This may set some sort of debugging functionalty so we keep this parameter while testing the login page.

Doing some manual testing, you will find that putting a quotation mark (') will give a special error with some information about the actual query being executed. Analysing the query, you will be able to find that a boolean based injection is possible.

> ' OR 1=1 -- 

Using this payload, you are able to bypass the login and obtain the flag.