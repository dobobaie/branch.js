## Branch.js

### Who I am ?
Branch.js is my name. I am a wrapper of Three.js project.
My function is to facilitate you in the construction of your program

### How I work ?
I own a few function to easily make geometric figures.
My object manager allows you to keep all your objects in my historic and interact with them where you want in your code.

### Can I use Three.js and you in same time ?
Yeah sure ! I'm just a wrapper and you can call Three.js in my system when you want.
You can get some example in the "Examples" directory.

### How can I call you in my code ?
"BRANCH" like my name :)

### Do you have some things different between Three.js and you ?
Actually yes ! I own 3 important function "init", "update" and "draw"

"init" create a new Three.js area in the dom.
```
BRANCH.scene(function() {
	this.height = 200;
	this.width = 200;
});
```

"update" is a asynchronous callback with the draw function.
It was created to let you make some change on your objets every X ms.
```
BRANCH.update(function() {
	// ...
})
```

"draw" is a callback in real "draw" function.
Which means the real "draw" function will waiting your function until it finishes before to draw.
```
BRANCH.draw(function() {
	// ...
})
```
### Functionality
Read the wiki

## Installation
### Keep Three.js !
You have to keep three.js file and after it put branch.js

### After this
"BRANCH" ... ;)

## CONTRIBUTING
Soon ...

Quickly =>

In the code 
	- variable prefix "_" (increment it in each inception)
	- return function in object use "this.myFunction"
	- don't return function in object use "var $myFunction"
