# s4
Version 0.9.2 (beta) - Tue 1 Mar 2016
(use at your own risk :) )

by Viktor Tassi  
<http://www.tassiviktor.hu/>

Introduction
------------
S4 is a small (~6k minified uncompressed) jQuery alternative for small projects. My primary goals were simple implementation and keep  the size small. Target platform is the all modern browsers (and Ie9+). 

Partial support for Ie8+ is added by polyfills (ie8fixes.js).

S4 syntax is more or less jQuery 1.x compatible.

Available methods
------------

+ .on()
+ .off()
+ .ready()
+ .each()
+ .parent()
+ .hasClass()
+ .addClass()
+ .removeClass()
+ .toggleClass()
+ .css()
+ .hasAttr()
+ .attr()
+ .removeAttr()
+ .data()
+ .aria()
+ .hide()
+ .show()
+ .before()
+ .append()
+ .after()
+ .remove()
+ .replaceWith()
+ .first()
+ .last()
+ .get()
+ .html()
+ .text() 
+ .val()
+ .serializeArray()
+ .serialize()
+ .serializeJSON()
+ $.now()
+ $.type()
+ $.inArray()
+ $.isArray()
+ $.map()
+ $.trim()
+ $.parseJSON()
+ $.parseHTML
+ $.each()
+ $.param()
+ $.stop()
+ $.ajax()

Examples
---------------

Simple ajax call test case

```javascript
$.ajax({
        type: "POST",
        url: "http://your-server-address/path-to/file",
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: $("#your-form-id").serialize(), 
        dataType: null, //autodetect
        processData: null, // default true
        username: "admin",
        password: "whatever",
        statusCode: {
            404: function () {
                alert("page not found");
            }
        },
        beforeSend: function (r, a) {
            console.log("Beforesend: " + r + a);
        },
        success: function (resp) {
            console.log("Succ: ");

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("ERR: " + textStatus + " " + errorThrown);
        },
        complete: function (xhr, status) {
            console.log("Complete: " + status);

        }
    });
```

Version History
---------------
0.9.2 (1 Mar 2016)

+ s4.ajax() added. A simple test scenario runs nicely. My implementation has no "traditional" option (as seen in jQuery).
+ An untested IE compatibility has been added. It has some prototype of array functions and an element.classlist implementation.

0.9.1 (1 Mar 2016)

+ .serializeArray(), .serialize(), serializeJSON() were added

0.9 (29 Feb 2016):

+ Initial commit

Licence (MIT)
------------
Copyright (c) 2016 Viktor Tassi

<http://www.tassiviktor.hu/>   

All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


