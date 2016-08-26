# CoreListener

Javascript class helps track changes in array and object:


##NPM
`npm install core-listener`

## Create instance
```html
<script>
  var listener = new CoreListener();
</script>
```

## For array
```html
<script>
 var array = [1, 2, 3];
 
  listener.add({
    entity: array,
    callback: function (args) {
      console.log('method:' + args.method); // called method to change the array
      console.info(args.previousValue); // previos value of the array
      console.warn(args.value); // current value of the array
    }
  });

  array.push(4); // called callback
  array.splice(5, 0, 'wow'); // called callback

  listener.remove({
    entity: array
  });
  
  array.pop(); // NOT called callback
</script>
```
 
## For object
```html
<script>
  var user = {
      name: 'John',
      age: 25
    }
  
    listener.add({
        entity: user,
        properties: ['name', 'age'],
        callback: function(args) {
          console.log('props:' + args.prop); // changed property
          console.info(args.previousValue); // previos value of the object
          console.warn(args.value); // current value of the object
        }
      });
  
    user.age = 30; // called callback
  
    listener.remove({
      entity: user,
      properties: 'age'
    });
  
    user.age = 32 // NOT called callback
    user.name = 'Jordan' // called callback
</script>
```

##Browser Support
All modern browsers and IE9+
