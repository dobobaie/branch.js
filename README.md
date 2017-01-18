## Branch.js

### Who I am ?
Branch.js my name, is a wrapper of Three.js project.
My function is to facilitate you in the construction of your program

### How it works ?
I own a few function to easily make geometric figures.
My object manager allows you to keep all your objects in my historic and interact with them where you want in your code.

### Can I use Three.js and you in same time ?
Yeah sure ! I'm just a wrapper and you can call Three.js in my system when you want.

### How can I call you in my code ?
"BRANCH" like my name :)

### Do you have some things different between Three.js and you ?
Actually yes because I own 3 important function "init", "update" and "draw"

"init" create a new Three.js area
```
BRANCH.init(function() {
	this.el = document.getElementById('canvas');
	this.height = 200;
	this.width = 200;
});
```

"update" is a callback asych with draw to let you make some change on your objets before the draw
```
BRANCH.update(function() {
	// ...
})
```

"draw" is a callback asych with update to ajust your objects before the actual draw
```
BRANCH.draw(function() {
	// ...
})
```
